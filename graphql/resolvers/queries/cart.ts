import { APIError } from "encore.dev/api";
import { cart } from "~encore/clients";
import { CartsResponse, QueryResolvers } from "../../__generated__/resolvers-types";
import { getFields } from "../../../helpers/graphql";
import { Context } from "../../graphql";

export const cartQuery: QueryResolvers["cart"] = async (_, __, context: Context, info): Promise<CartsResponse> => {
    try {
        const fields = (getFields(info))["carts"].join(",")

        const carts = await cart.getCarts({ fields, session_id: context.session_id })

        if (carts.carts.length === 0) {
            throw APIError.notFound("data not found")
        }

        return {
            carts: carts.carts.map(cart => ({
                // TODO: is product_deleted
                is_product_deleted: false,
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