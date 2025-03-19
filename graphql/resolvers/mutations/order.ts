import { APIError } from "encore.dev/api";
import { emptyError, parseError } from "../../../helpers/error";
import { ErrorResponse, MutationMakeOrderArgs, MutationResolvers } from "../../__generated__/resolvers-types";
import { getAuthData } from "~encore/auth";
import { cart as cartClient, order as orderClient, product, product as productClient } from "~encore/clients";
import { ProductEntity } from "../../../services/product/db";

export const makeOrderMutation: MutationResolvers["makeOrder"] = async (_, { request }: Partial<MutationMakeOrderArgs>): Promise<ErrorResponse> => {
    try {
        if (!request || !request.cart_id) {
            throw APIError.invalidArgument("invalid request")
        }

        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        const cartIds = request.cart_id.join(",")
        const { carts } = await cartClient.getCarts({ fields: "", cart_ids: cartIds })

        if (carts.length == 0 || request.cart_id.length != carts.length) {
            throw APIError.notFound("Cart id not found")
        }

        // product_id, qty
        let recordCartProducts: Record<number, number> = {}
        let productIds: string[] = []
        for (const cart of carts) {
            recordCartProducts[Number(cart.product_id)] = Number(cart.qty)
            productIds.push(String(cart.product_id))
        }

        const { products } = await productClient.getProducts({
            productIds: productIds.join(","),
            isOwner: false,
            cursor: 1,
            limit: productIds.length + 1
        })

        let recordProducts: Record<number, ProductEntity> = {}
        for (const product of products) {
            // check if product_id stock valid
            if (Number(product.stock_quantity) < recordCartProducts[Number(product.id)] ||
                Number(product.stock_quantity) <= 0) {
                throw APIError.invalidArgument("product id: " + String(product.id) + " stock is not enough")
            }

            recordProducts[Number(product.id)] = product
        }

        const { orderIds } = await orderClient.createOrder({ carts, products: recordProducts })
        if (orderIds.length == 0) {
            throw APIError.internal("Failed to make order")
        }

        await cartClient.deleteMultiCart({ ids: cartIds })

        // TODO! order address

        // get carts
        return emptyError()
    } catch (err) {
        return parseError(err)
    }
}

// TODO! cancel order on status 0 by customer