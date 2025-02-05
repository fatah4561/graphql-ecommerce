import { SQLDatabase } from "encore.dev/storage/sqldb"
import knex from "knex"
import { User, UserDetail } from "../../graphql/__generated__/resolvers-types"

const UserDB = new SQLDatabase("user", {
    migrations: "./migrations"
})

const orm = knex({
    client: "pg",
    connection: UserDB.connectionString
})

export type UserEntity = Omit<User & { 
    password_hash?: string 
}, "__typename" | "response">
export const Users = () => orm<UserEntity>("users")

export type UserDetailEntity = Omit<UserDetail & {
    province_id: number | undefined,
    city_id: number | undefined,
    district_id: number | undefined
}, "__typename" | "province" | "district" | "city">
export const UserDetails = () => orm<UserDetailEntity>("user_details")