import { shipping as shippingClient } from "~encore/clients";
import { parseError } from "../../../helpers/error";
import { ErrorResponse, MutationResolvers, MutationSaveShippingAddressArgs, SaveShippingAddressResponse } from "../../__generated__/resolvers-types";
import { APIError } from "encore.dev/api";

export const saveShippingAddressMutation: MutationResolvers["saveShippingAddress"] = async (_, { address }: Partial<MutationSaveShippingAddressArgs>): Promise<SaveShippingAddressResponse> => {
    try {
        if (!address) {
            throw APIError.invalidArgument("request incomplete")
        }

        if (address.is_favorite) {
            await shippingClient.unsetFavoriteShippingAddress()
        }

        const { shippingAddress } = await shippingClient.saveShippingAddress({ shippingAddress: address })
        return { ...shippingAddress }
    } catch (err) {
        return parseError(err)
    }
}