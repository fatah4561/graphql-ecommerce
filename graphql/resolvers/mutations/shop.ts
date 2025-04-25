import {shop as shopClient } from "~encore/clients"
import { MutationResolvers, SaveShopRequest, Shop, ShopsResponse } from "../../__generated__/resolvers-types";
import { parseError } from "../../../helpers/error";

export const saveShopMutation: MutationResolvers["saveShop"] = async (_, { shop }: any): Promise<ShopsResponse> => {
    try {
        const request = shop as SaveShopRequest
        // TODO if creating new shop then set token to expire
        const { savedShop } = await shopClient.saveShop({ shop: request })
        return { shops: [savedShop as Shop] }
    } catch (err) {
        return parseError(err)
    }
}