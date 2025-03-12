import { shipping as shippingClient } from "~encore/clients";
import { parseError } from "../../../helpers/error";
import { getFields } from "../../../helpers/graphql";
import { QueryResolvers, ShippingAddressResponse } from "../../__generated__/resolvers-types";
import { APIError } from "encore.dev/api";

export const shippingAddressQuery: QueryResolvers["shippingAddress"] = async (_, __, ___, info): Promise<ShippingAddressResponse> => {
    try {
        const fields = (getFields(info))["shippingAddresses"].join(",")

        const { shippingAddresses } = await shippingClient.getUserShippingAddresses({ fields })

        if (shippingAddresses.length === 0) {
            throw APIError.notFound("data not found")
        }

        console.log("achi", shippingAddresses)

        return {
            shippingAddresses: shippingAddresses.map(address => ({ ...address }))
        }
    } catch (err) {
        return parseError(err)
    }
}