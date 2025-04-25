import { APIError } from "encore.dev/api";
import { cart as cartClient, product as productClient } from "~encore/clients";
import { AddToCartResponse, ErrorResponse, MutationAddToCartArgs, MutationDeleteFromCartArgs, MutationResolvers, MutationUpdateCartQtyArgs } from "../../__generated__/resolvers-types";
import { Context } from "../../graphql";
import { getFields } from "../../../helpers/graphql";
import { handleRustOrAPIError, parseError } from "../../../helpers/error";
import { getAuthData } from "~encore/auth";

export const addToCartMutation: MutationResolvers["addToCart"] = async (_, { cart }: Partial<MutationAddToCartArgs>, context: Context, info): Promise<AddToCartResponse> => {
    try {
        if (!cart) {
            throw APIError.invalidArgument("incomplete request")
        }

        const fields = (getFields(info))["Cart"]

        const { products } = await productClient.checkProductsExist({ productIds: [cart.product_id] })
        if (!products || !products[cart.product_id]) {
            throw APIError.notFound("product not found")
        }

        const authData = getAuthData()
        if (authData) {
            const {isOwner} = await productClient.isProductOwner({
                id: cart.product_id,
                userId: Number(authData.userID)
            })

            if (isOwner) {
                throw APIError.invalidArgument("Can't order owned product")
            }
        }

        const { carts } = await cartClient.addToCart({ fields, cart, session_id: context.session_id }).catch(err => {
            throw handleRustOrAPIError(err)
        })

        return { ...carts }
    } catch (err) {
        return parseError(err)
    }
}

export const updateCartQtyMutation: MutationResolvers["updateCartQty"] = async (_, { id, qty }: Partial<MutationUpdateCartQtyArgs>, context: Context): Promise<ErrorResponse> => {
    try {
        await cartClient.updateCartQty({
            id: Number(id),
            session_id: context.session_id,
            qty: Number(qty),
        })

        return { code: "", message: "" }
    } catch (err) {
        return parseError(err)
    }
}

export const deleteFromCartMutation: MutationResolvers["deleteFromCart"] = async (_, { id }: Partial<MutationDeleteFromCartArgs>, context: Context): Promise<ErrorResponse> => {
    try {
        await cartClient.deleteCart({
            id: Number(id),
            session_id: context.session_id,
        })

        return { code: "", message: "" }
    } catch (err) {
        return parseError(err)
    }
}