import { APIError } from "encore.dev/api";
import { emptyError, parseError } from "../../../helpers/error";
import { ErrorResponse, MutationMakeOrderArgs, MutationResolvers } from "../../__generated__/resolvers-types";
import { getAuthData } from "~encore/auth";
import { cart as cartClient, order as orderClient, product as productClient, shipping as shippingClient } from "~encore/clients";
import { ProductEntity } from "../../../services/product/db";
import { NewShippingAddressEntity } from "../../../services/shipping/db";

export const makeOrderMutation: MutationResolvers["makeOrder"] = async (_, { request }: Partial<MutationMakeOrderArgs>): Promise<ErrorResponse> => {
    try {
        if (!request || !request.cart_id) {
            throw APIError.invalidArgument("invalid request")
        }

        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        // shipping address
        let shippingAddress = NewShippingAddressEntity()
        if (request.shipping_address_id) {
            const res = await shippingClient.getUserSingleShippingAddress({id: request.shipping_address_id})
            shippingAddress = res.shippingAddress
        } else {
            const res = await shippingClient.getUserFavoriteShippingAddress()
            shippingAddress = res.shippingAddress
        }

        if (!shippingAddress || !shippingAddress.id) {
            throw APIError.failedPrecondition("Please choose correct shipping address or create a new one")
        }
        // --end shipping address

        const cartIds = request.cart_id.join(",")
        const { carts } = await cartClient.getCarts({ fields: "", cart_ids: cartIds })

        if (carts.length == 0 || request.cart_id.length != carts.length) {
            throw APIError.notFound("Cart id not found")
        }

        let recordCartProducts: Record<number, number> = {} // product_id, qty
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

        for (const orderId of orderIds) {
            await shippingClient.createShippingOrder({ request: shippingAddress, orderId })
        }

        return emptyError()
    } catch (err) {
        return parseError(err)
    }
}

// TODO! cancel order on status 0 by customer