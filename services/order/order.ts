import { api, APIError } from "encore.dev/api";
import { OrderEntity, OrderItemEntity, OrderItems, Orders, OrderStatusEnum, RawOrder } from "./db";
import { getAuthData } from "~encore/auth";
import { CartEntity } from "../cart/db";
import { ProductEntity } from "../product/db";

export const getMyOrders = api(
    { method: "GET", path: "/order", auth: true },
    async ({ fields }: { fields: string }): Promise<({ orders: OrderEntity[], total: number })> => {
        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        const query = Orders().where("user_id", authData.userID)

        if (fields) {
            query.column(fields.split(","))
        }

        const orders = await query.select<OrderEntity[]>()

        return {
            orders: orders.map(order => ({
                ...order,
                id: Number(order.id),
                user_id: Number(order.user_id),
                shop_id: Number(order.shop_id),
            })),
            total: orders.length
        }
    }
)

export const getShopOrders = api( // for shop owner
    { method: "GET", path: "/order/shop:shop_id", auth: true },
    async ({ shop_id, fields }: { shop_id: number, fields: string }): Promise<({ orders: OrderEntity[], total: number })> => {
        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        const query = Orders().where("shop_id", shop_id)

        if (fields) {
            query.column(fields.split(","))
        }

        const orders = await query.select<OrderEntity[]>()

        return {
            orders: orders.map(order => ({
                ...order,
                id: Number(order.id),
                user_id: Number(order.user_id),
                shop_id: Number(order.shop_id),
            })),
            total: orders.length
        }
    }
)

export const getOrderItems = api( // when user request items detail 
    { method: "GET", path: "/order/items", auth: true },
    async ({ fields, order_ids }: { fields: string, order_ids: string }): Promise<({ orderItems: Record<number, OrderItemEntity[]> })> => { // order_id, items[]
        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        const query = OrderItems().whereIn("order_id", order_ids.split(","))

        if (fields) {
            query.column(fields.split(","))
        }

        // TODO? maybe there is better ways without loop?
        const orderItems = await query.select<OrderItemEntity[]>()
        let recordOrderItems: Record<number, OrderItemEntity[]> = {}

        orderItems.forEach(orderItem => {
            orderItem.id = Number(orderItem.id)
            recordOrderItems[orderItem.id].push(orderItem)
        })

        return { orderItems: recordOrderItems }
    }
)

export const createOrder = api(
    { method: "POST", path: "/order", auth: true },
    async ({ carts, products }: { carts: CartEntity[], products: Record<number, ProductEntity> }): Promise<({ orderIds: number[] })> => {
        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        /**
         *  we will merge same shop cart into single order
         */
        const recordOrders: Record<number, OrderEntity> = {} // shopId, order
        const recordOrderItems: Record<number, OrderItemEntity[]> = {} // shopId, orderItems

        carts.forEach(cart => {
            const shopId = Number(cart.shop_id)
            const productId = Number(cart.product_id)
            const product = products[productId]

            recordOrders[shopId] ||= {
                user_id: Number(cart.user_id),
                shop_id: shopId,
                total_amount: 0,
                status: OrderStatusEnum.PENDING,
            };
            recordOrders[shopId].total_amount += Number(cart.qty) * Number(product.price)

            recordOrderItems[shopId] ||= []
            recordOrderItems[shopId].push({
                order_id: 0,
                product_id: productId,
                product_name: product.name,
                product_description: String(product.description),
                price: Number(product.price),
                quantity: Number(cart.qty),
            })
        })

        const orderIds: number[] = []
        for (const [shopId, order] of Object.entries(recordOrders)) {
            // TODO? maybe use transaction next time
            const result = await Orders().insert(order, ["id"])
            const orderId = Number(result[0].id)
            orderIds.push(orderId)

            recordOrderItems[Number(shopId)].forEach(async orderItem => {
                orderItem.order_id = orderId
                await OrderItems().insert(orderItem)
            })
        }
        return { orderIds }
    }
)
