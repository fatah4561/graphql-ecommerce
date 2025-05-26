import { api } from "encore.dev/api";
import { PaymentEntity, Payments } from "./db";
import { PaymentOption } from "../../graphql/__generated__/resolvers-types";

// this is where the payment hit 3rd party gateway
export const initPayment = api(
    { method: "POST", path: "/pay/init" },
    async (): Promise<{ externalId: string, metadata: string }> => {
        // TODO
        // TODO hit payment retry on fail
        return { externalId: "", metadata: "" }
    }
)

// this is where we can get payment review
export const inqPayment = api(
    { method: "POST", path: "/pay/inq" },
    async (): Promise<{}> => {
        // TODO
        return {}
    }
)

export const getPaymentOptions = api(
    { method: "GET", path: "/pay/option" },
    async ({ fields }: { fields: string }): Promise<{ paymentOptions: PaymentOption[] }> => {
        // TODO
        return { paymentOptions: [] }
    }
)

export const createPayment = api(
    { method: "POST", path: "/pay" },
    async ({ request }: { request: PaymentEntity }): Promise<{ paymentId: number }> => {
        // hit 3rd party
        const { externalId, metadata } = await initPayment()

        const newPayment: PaymentEntity = {
            created_at: (new Date()).toISOString(),

            ...request
        }

        const payment = (await Payments().insert(newPayment, "*"))[0]

        return { paymentId: Number(payment.id) }
    }
)

export const callbackPayment = api(
    { method: "POST", path: "/payment-callback" },
    async ({ request }: { request: any }): Promise<{ }> => {
        // TODO

        return { }
    }
)