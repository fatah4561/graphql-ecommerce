import { SQLDatabase } from "encore.dev/storage/sqldb"
import { User } from "../graphql/__generated__/resolvers-types"
import knex from "knex"

const UserDB = new SQLDatabase("user", {
    migrations: "./migrations"
})

const orm = knex({
    client: "pg",
    connection: UserDB.connectionString
})

export type UserEntity = Omit<User&{password_hash?: string}, "__typename" | "response">
export const Users = () => orm<UserEntity>("users")