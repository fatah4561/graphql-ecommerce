import { SQLDatabase } from "encore.dev/storage/sqldb";
import knex from "knex";
import { Cart } from "../../graphql/__generated__/resolvers-types";

const CartDB = new SQLDatabase("cart", {
    migrations: "./migrations"
})

const orm = knex({
    client: "pg",
    connection: CartDB.connectionString
})

export type CartEntity = Omit<Cart & {
    user_id?: number,
    session_id?: string,
}, "__typename" | "is_product_deleted"> // is_product_deleted is only flag for FE
export const Carts = () => orm<CartEntity>("carts")