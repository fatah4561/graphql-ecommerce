import { APIError, ErrCode } from "encore.dev/api";
import { cart as cartClient, product as productClient } from "~encore/clients";
import { AddToCartResponse, CartsResponse, MutationAddToCartArgs, MutationDeleteFromCartArgs, MutationResolvers, MutationUpdateCartQtyArgs } from "../../__generated__/resolvers-types";
import { Context } from "../../graphql";
import { getFields } from "../../../helpers/graphql";

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
        const apiError = err as APIError
        return {
            code: apiError.code ?? ErrCode.Internal,
            message: apiError.message ?? String(err),
        };
    }
}

export const updateCartQtyMutation: MutationResolvers["updateCartQty"] = async (_, { id, qty }: Partial<MutationUpdateCartQtyArgs>): Promise<CartsResponse> => {
    try {

        return {}
    } catch (err) {
        const apiError = err as APIError
        return {
            code: apiError.code ?? ErrCode.Internal,
            message: apiError.message ?? String(err),
        };
    }
}

export const deleteFromCartMutation: MutationResolvers["deleteFromCart"] = async (_, { id }: Partial<MutationDeleteFromCartArgs>): Promise<CartsResponse> => {
    try {

        return {}
    } catch (err) {
        const apiError = err as APIError
        return {
            code: apiError.code ?? ErrCode.Internal,
            message: apiError.message ?? String(err),
        };
    }
}