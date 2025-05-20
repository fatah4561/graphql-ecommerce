import { SQLDatabase } from "encore.dev/storage/sqldb"
import knex from "knex"

const PaymentDB = new SQLDatabase("payments", {
    migrations: "./migrations"
})

const orm = knex({
    client: "pg",
    connection: PaymentDB.connectionString
})

export type PaymentEntity = {
    id?: number
    order_id?: number
    gateway?: string
    method?: string
    external_id?: string
    amount?: number
    status?: string
    metadata?: string
    created_at?: string
}

export const Payments = () => orm<PaymentEntity>("payments")