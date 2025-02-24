import { APIError } from "encore.dev/api";
import { cart as cartClient, product as productClient } from "~encore/clients";
import { AddToCartResponse, ErrorResponse, MutationAddToCartArgs, MutationDeleteFromCartArgs, MutationResolvers, MutationUpdateCartQtyArgs } from "../../__generated__/resolvers-types";
import { Context } from "../../graphql";
import { getFields } from "../../../helpers/graphql";
import { parseError } from "../../../helpers/error";

export const addToCartMutation: MutationResolvers["addToCart"] = async (_, { cart }: Partial<MutationAddToCartArgs>, context: Context, info): Promise<AddToCartResponse> => {
    try {
        if (!cart) {
            throw APIError.invalidArgument("incomplete request")
        }

        const fields = (getFields(info))["Cart"]

        const product = await productClient.checkProductsExist({ productIds: [cart.product_id] })
        if (!product || !product.products[cart.product_id]) {
            throw APIError.notFound("product not found")
        }

        const carts = await cartClient.addToCart({ fields, cart, session_id: context.session_id })
        return { ...carts.cart }
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

        return {code: "", message: ""}
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

        return {code: "", message: ""}
    } catch (err) {
        return parseError(err)
    }
}