import { SQLDatabase } from "encore.dev/storage/sqldb"
import knex from "knex"

const PaymentDB = new SQLDatabase("payments", {
    migrations: "./migrations"
})

const orm = knex({
    client: "pg",
    connection: PaymentDB.connectionString
})

export enum PaymentStatus {
    PENDING = 0, // init, created
    PAID = 1,
    FAILED = 2,
    CANCELLED = 3,
}

export type PaymentEntity = {
    id?: number
    order_id?: number
    gateway?: string
    method?: string
    external_id?: string
    amount?: number
    status?: string
    metadata?: string
    note?: string // might be use on cancel or failed detail
    created_at?: string
}

export const Payments = () => orm<PaymentEntity>("payments")