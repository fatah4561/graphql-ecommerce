import { payment as paymentClient } from "~encore/clients";
import { parseError } from "../../../helpers/error";
import { getFields } from "../../../helpers/graphql";
import { PaymentOptionResponse, QueryResolvers } from "../../__generated__/resolvers-types";

export const paymentOptionQuery: QueryResolvers["paymentOption"] = async (_, __, ___, info): Promise<PaymentOptionResponse> => {
    try {
        const fields = (getFields(info))["paymentOptions"].join(",")

        const { paymentOptions } = await paymentClient.getPaymentOptions({ fields })

        return { paymentOptions }
    } catch (err) {
        return parseError(err)
    }
}