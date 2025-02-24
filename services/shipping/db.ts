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