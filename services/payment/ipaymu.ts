import { secret } from "encore.dev/config";
import { PaymentOption } from "../../graphql/__generated__/resolvers-types";
import { appConfig } from "../../helpers/app_config";
import { DirectPaymentResponse, GatewayResponse, PaymentGateway, RedirectPaymentResponse } from "./payment_gateway";

interface iPaymuConfig {
    va: string
    apiKey: string
}

const apiKey = secret("API_KEY")
const va = secret("VA_KEY")

export class iPaymuGateway implements PaymentGateway {
    constructor(private readonly config: iPaymuConfig) { }

    async getPaymentOptions(): Promise<GatewayResponse<PaymentOption[]>> {
        this.config.apiKey
        // throw new Error("Method not implemented.");
        return {
            parsed: [],
            raw: ""
        }
    }
    async createDirectPayment(): Promise<GatewayResponse<DirectPaymentResponse>> {
        // throw new Error("Method not implemented.");
        return {
            parsed: {
                status: 0,
                message: "",
                ref_id: "",
                external_id: ""
            },
            raw: ""
        }
    }
    async createRedirectPayment(): Promise<GatewayResponse<RedirectPaymentResponse>> {
        return {
            parsed: {
                url: ""
            }, raw: ""
        }
    }

}

export const createIpaymuGateway = (): iPaymuGateway => {
    const paymentConfig = appConfig().payment

    // const va = secret(paymentConfig.gateways.ipaymu.va as keyof typeof secret)

    return new iPaymuGateway({ va: "", apiKey: apiKey() })
}