import { SQLDatabase } from "encore.dev/storage/sqldb";
import knex from "knex";
import { Order, OrderItem } from "../../graphql/__generated__/resolvers-types";

export enum OrderStatusEnum {
    PENDING = 0,
    PAID = 1,
    PROCESSING = 2, // or packaging
    SHIPPING = 3,
    DELIVERED = 4,
    COMPLETED = 5,
    CANCELLED = 6,
}

const OrderDB = new SQLDatabase("order", {
    migrations: "./migrations"
})

const orm = knex({
    client: "pg",
    connection: OrderDB.connectionString
})

export type OrderEntity = Omit<Order&{
    user_id?: number // TODO? change it to customer_id
}, "__typename" | "order_items">
export const Orders = () => orm<OrderEntity>("orders")

export type OrderItemEntity = Omit<OrderItem, "__typename">
export const OrderItems = () => orm<OrderItemEntity>("order_items")

export const RawOrder = orm