import { api, APIError } from "encore.dev/api";
import { OrderCancelByEnum, OrderEntity, OrderItemEntity, OrderItems, Orders, OrderStatusEnum, RawOrder } from "./db";
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
            query.column(["id", ...fields.split(",")])
        }

        const orders = await query.select<OrderEntity[]>()
        orders.forEach(order => {
            order.id = Number(order.id)
            order.user_id !== null ? Number(order.user_id) : null
            order.shop_id = Number(order.shop_id)
            order.total_amount = Number(order.total_amount)
        });

        return {
            orders: orders.map(order => ({
                ...order,
            })),
            total: orders.length
        }
    }
)

export const getShopOrders = api( // for shop owner
    { method: "GET", path: "/order/shop", auth: true },
    async ({ fields }: { fields: string }): Promise<({ orders: OrderEntity[], total: number })> => {
        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        if (!authData.shopID) {
            throw APIError.failedPrecondition("Doesn't own a shop, please create a new one")
        }

        const query = Orders().where("shop_id", authData.shopID)

        if (fields) {
            query.column(["id", ...fields.split(",")])
        }

        const orders = await query.select<OrderEntity[]>()
        orders.forEach(order => {
            order.id = Number(order.id)
            order.user_id !== null ? Number(order.user_id) : null
            order.shop_id = Number(order.shop_id)
            order.total_amount = Number(order.total_amount)
        });

        return {
            orders: orders.map(order => ({
                ...order,
            })),
            total: orders.length
        }
    }
)

export const getSingleOrder = api(
    { method: "GET", path: "/order/:id", auth: true },
    async ({ id, fields, as_shop }: { id: number, fields: string, as_shop: boolean }): Promise<({ order: OrderEntity })> => {
        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        const query = Orders().where("id", id)
        if (as_shop) {
            query.andWhere("shop_id", authData.shopID)
        } else {
            query.andWhere("user_id", authData.userID)
        }

        if (fields) {
            query.column(["user_id", ...fields.split(",")])
        }

        const order = await query.select<OrderEntity>().first()
        if (!order) {
            throw APIError.notFound("Data not found")
        }
        order.id = Number(order.id)
        order.total_amount = Number(order.total_amount)

        return { order }
    }
)

export const getOrderItems = api( // when user request items detail 
    { method: "GET", path: "/order/items", auth: true },
    async ({ fields, order_ids }: { fields: string, order_ids: string }): Promise<({ orderItems: Record<number, OrderItemEntity[]> })> => { // order_id, items[]
        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        if (!order_ids) {
            return { orderItems: [] }
        }

        const query = OrderItems().whereIn("order_id", order_ids.split(","))

        if (fields) {
            query.column(fields.split(","))
        }

        // TODO? maybe there is better ways without loop?
        const orderItems = await query.select<OrderItemEntity[]>()
        let recordOrderItems: Record<number, OrderItemEntity[]> = {}

        if (orderItems.length == 0) {
            return { orderItems: [] }
        }

        orderItems.forEach(orderItem => {
            orderItem.id = Number(orderItem.id)
            orderItem.order_id = Number(orderItem.order_id)
            orderItem.price = Number(orderItem.price)
            orderItem.subtotal = Number(orderItem.subtotal)

            if (!recordOrderItems[orderItem.order_id] || recordOrderItems[orderItem.order_id].length === 0) {
                recordOrderItems[orderItem.order_id] = [orderItem]
            } else {
                recordOrderItems[orderItem.order_id].push(orderItem)
            }
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

// able to cancel both shop and buyer order at once (wow.wav)
export const cancelOrder = api(
    { method: "PUT", path: "/order:id", auth: true },
    async ({ ids, cancel_note }: { ids: number[], cancel_note: string }): Promise<({ cancelledIds: number[] })> => {
        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        const orders = await Orders()
            .whereIn("status", [
                OrderStatusEnum.PENDING,
                // OrderStatusEnum.PAID, // TODO must add refund
            ])
            .whereIn("id", ids)
            .andWhere(db => {
                db.where("user_id", "=", authData.userID)
                .orWhere("shop_id", "=", authData.shopID)
            })
            .select<OrderEntity[]>()
        
        let cancelAsUserIds: number[] = []
        let cancelAsShopIds: number[] = []

        orders.forEach(order => {
            if (!order.id || !order.user_id || !order.shop_id) {
                return
            }

            if (order.user_id.toString() == authData.userID) {
                cancelAsUserIds.push(Number(order.id))
            } else if (order.shop_id == authData.shopID) {
                cancelAsShopIds.push(Number(order.id))
            }
        })

        await Orders()
        .whereIn("id", cancelAsUserIds)
        .update({
            status: OrderStatusEnum.CANCELLED,
            cancel_note,
            cancel_by: OrderCancelByEnum.BUYER,
            updated_at: (new Date()).toISOString(),
            cancelled_at: (new Date()).toISOString(),
        })

        await Orders()
        .whereIn("id", cancelAsShopIds)
        .update({
            status: OrderStatusEnum.CANCELLED,
            cancel_note,
            cancel_by: OrderCancelByEnum.SELLER,
            updated_at: (new Date()).toISOString(),
            cancelled_at: (new Date()).toISOString(),
        })

        return { cancelledIds: [...cancelAsShopIds, ...cancelAsUserIds].sort() }
    }
)