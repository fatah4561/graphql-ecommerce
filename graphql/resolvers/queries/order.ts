import log from "encore.dev/log";
import { parseError } from "../../../helpers/error";
import { getFields } from "../../../helpers/graphql";
import { Order, OrderItem, OrderList, OrdersResponse, QueryOrderArgs, QueryResolvers } from "../../__generated__/resolvers-types";
import { Context } from "../../graphql";
import { order as orderClient, user } from "~encore/clients"
import { APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { OrderEntity, OrderItemEntity } from "../../../services/order/db";

export const orderQuery: QueryResolvers["order"] = async (_, { id, as_shop }: Partial<QueryOrderArgs>, context: Context, info): Promise<OrdersResponse> => {
    try {
        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("You must login first!")
        }

        const fields = getFields(info)
        let orderIds: number[] = []

        // get main order(s)
        let ordersEntity: OrderEntity[] = []
        if (id) { // singular 
            const { order } = await orderClient.getSingleOrder({
                id: id ?? 0,
                fields: fields["Order"].filter(field => field !== "order_items").join(","),
                as_shop: as_shop ?? false,
            }).catch(err => {
                log.error(err)
                return { order: null }
            })

            if (!order || !order.id) {
                throw APIError.notFound("Order not found")
            }

            orderIds.push(id)
            ordersEntity.push(order)
        } else {
            if (as_shop) {
                const { orders } = await orderClient.getShopOrders({
                    fields: fields["orders"].filter(field => field !== "order_items").join(",")
                }).catch(err => {
                    log.error(err)
                    return { orders: [] }
                })
                ordersEntity = orders
            } else {
                const { orders } = await orderClient.getMyOrders({
                    fields: fields["orders"].filter(field => field !== "order_items").join(",")
                }).catch(err => {
                    log.error(err)
                    return { orders: [] }
                })
                ordersEntity = orders
            }

            if (!ordersEntity) {
                throw APIError.notFound("Order not found")
            }

            ordersEntity.forEach(order => {
                if (order.id) {
                    orderIds.push(order.id)
                }
            })
        }
        // --end get main order(s)

        // get order products (if requested)
        let orderItemsEntity: Record<number, OrderItemEntity[]> = []
        if (fields["order_items"]) {
            const { orderItems } = await orderClient.getOrderItems({
                fields: fields["order_items"].join(","),
                order_ids: orderIds.join(",") ?? ""
            }).catch(err => {
                log.error(err)
                return { orderItems: null }
            })

            if (orderItems) {
                orderItemsEntity = orderItems
            }
        }
        // --end get order products (if requested)


        // by this point order must exist
        if (id) { // singular response
            return {
                ...ordersEntity[0],
                order_items: orderItemsEntity[id]
            } as Order
        }

        // multiple response (array)
        let ordersResponse: Order[] = []
        ordersEntity.forEach(orderEntity => {
            let orderItems: OrderItem[] = []
            if (orderEntity.id) { // user must request order id to get items
                orderItems = orderItemsEntity[orderEntity.id]
            }

            // this can exist without id if user not requested
            ordersResponse.push({
                ...orderEntity,
                order_items: orderItems
            })
        })
        return {
            orders: ordersResponse
        } as OrderList
    } catch (err) {
        return parseError(err)
    }
}