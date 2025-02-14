import { SQLDatabase } from "encore.dev/storage/sqldb"
import knex from "knex"
import { Shop } from "../../graphql/__generated__/resolvers-types"

const ShopDB = new SQLDatabase("shop", {
    migrations: "./migrations"
})

const orm = knex({
    client: "pg",
    connection: ShopDB.connectionString
})

export type ShopEntity = Omit<Shop, "__typename">
export const Shops = () => orm<ShopEntity>("shops")