// this is the abstraction

import { secret } from "encore.dev/config";
import { PaymentOption } from "../../graphql/__generated__/resolvers-types"
import { appConfig } from "../../helpers/app_config";
import { createIpaymuGateway, iPaymuGateway } from "./ipaymu";

export interface GatewayResponse<T> {
    parsed: T
    raw: string
}

export interface PaymentGatewayConfig {
    apiKey: string;
    merchantId?: string;
    callbackUrl?: string;
}

export type DirectPaymentResponse = {
    status: number
    message: string
    ref_id: string // this is the ref_id that we send
    external_id: string // this is the id from 3rd party (it can be transaction_id, reference_id, etc depends)
}

export type RedirectPaymentResponse = {
    url: string
}

export interface PaymentGateway {
    getPaymentOptions(): Promise<GatewayResponse<PaymentOption[]>>

    createDirectPayment(): Promise<GatewayResponse<DirectPaymentResponse>>
    createRedirectPayment(): Promise<GatewayResponse<RedirectPaymentResponse>>
}

export const createPaymentGateway = (): PaymentGateway => {
    const paymentConfig = appConfig().payment

    switch (paymentConfig.defaultGateway) {
        case "ipaymu":
            return createIpaymuGateway()
        case "midtrans":
            // TODO
        case "stripe":
            // TODO
        default: 
            return createIpaymuGateway()
    }
} 