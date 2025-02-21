import { APIError } from "encore.dev/api";
import { cart as cartClient, product as productClient } from "~encore/clients";
import { CartsResponse, QueryResolvers } from "../../__generated__/resolvers-types";
import { getFields } from "../../../helpers/graphql";
import { Context } from "../../graphql";

export const cartQuery: QueryResolvers["cart"] = async (_, __, context: Context, info): Promise<CartsResponse> => {
    try {
        const fields = (getFields(info))["carts"].join(",")

        const carts = await cartClient.getCarts({ fields, session_id: context.session_id })

        if (carts.carts.length === 0) {
            throw APIError.notFound("data not found")
        }

        let productIds: number[] = []
        for (const product of carts.carts) {
            productIds.push(...productIds, Number(product.product_id))
        }

        const productExists = await productClient.checkProductsDeleted({productIds})

        return {
            carts: carts.carts.map(cart => ({
                is_product_deleted: !productExists.products[Number(cart.product_id)],
                ...cart
            }))
        }
    } catch (err) {
        const apiError = err as APIError
        return {
            code: apiError.code,
            message: apiError.message,
        }
    }
}