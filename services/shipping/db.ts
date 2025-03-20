import { SQLDatabase } from "encore.dev/storage/sqldb";
import knex from "knex";
import { ShippingAddress } from "../../graphql/__generated__/resolvers-types";

const ShippingDB = new SQLDatabase("shipping", {
    migrations: "./migrations"
})

const orm = knex({
    client: "pg",
    connection: ShippingDB.connectionString
})

export type ShippingAddressEntity = Omit<ShippingAddress & {
    user_id: number
}, "__typename">
export const ShippingAddresses = () => orm<ShippingAddressEntity>("shipping_addresses")

export const NewShippingAddressEntity = (): ShippingAddressEntity => ({
    user_id: 0
})

/**
 * this table is to record shipping order chosen 
 * so even if user change the original address a history still intact
 *  */ 
export type ShippingOrderEntity = Omit<ShippingAddressEntity & {
    order_id: number
}, "is_favorite" | "updated_at">

export const ShippingOrder = () => orm<ShippingAddressEntity>("shipping_orders")