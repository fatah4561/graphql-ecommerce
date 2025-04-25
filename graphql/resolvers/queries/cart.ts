import { APIError } from "encore.dev/api";
import { cart as cartClient, product as productClient } from "~encore/clients";
import { CartsResponse, QueryResolvers } from "../../__generated__/resolvers-types";
import { getFields } from "../../../helpers/graphql";
import { Context } from "../../graphql";
import { parseError } from "../../../helpers/error";
import { getAuthData } from "~encore/auth";
import log from "encore.dev/log";

// TODO? maybe change into subscription
export const cartQuery: QueryResolvers["cart"] = async (_, __, context: Context, info): Promise<CartsResponse> => {
    try {
        const fields = (getFields(info))["carts"].filter(field => field !== "is_product_deleted").join(",")

        // check if somehow (edge case) user has their own products in cart then delete
        if (getAuthData()) {
            const { productIds } = await productClient.getMyProductIds().catch(err => {
                log.error(err)
                return { productIds: [] }
            })
            await cartClient.deleteYourOwnProductCart({ selfProductIds: productIds }).catch(err => {
                log.error(err)
            })
        }

        const { carts } = await cartClient.getCarts({ fields, session_id: context.session_id })

        if (carts.length === 0) {
            throw APIError.notFound("data not found")
        }

        let productIds: number[] = []
        for (const product of carts) {
            productIds.push(...productIds, Number(product.product_id))
        }

        const productExists = await productClient.checkProductsExist({ productIds })

        return {
            carts: carts.map(cart => ({
                is_product_deleted: !productExists.products[Number(cart.product_id)],
                ...cart
            }))
        }
    } catch (err) {
        return parseError(err)
    }
}