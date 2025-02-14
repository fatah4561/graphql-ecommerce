import { SQLDatabase } from "encore.dev/storage/sqldb"
import knex from "knex"
import { Product } from "../../graphql/__generated__/resolvers-types"

const ProductDB = new SQLDatabase("product", {
    migrations: "./migrations"
})

const orm = knex({
    client: "pg",
    connection: ProductDB.connectionString
})

export type ProductEntity = Omit<Product, "__typename">
export const Shops = () => orm<ProductEntity>("products")