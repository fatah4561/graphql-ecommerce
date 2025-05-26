import { user } from "~encore/clients";
import { getFields } from "../../../helpers/graphql";
import { QueryResolvers, ProfileResponse } from "../../__generated__/resolvers-types";
import { productsQuery } from "./product";
import { shopsQuery } from "./shop";
import { Context, version } from "../../graphql";
import { cartQuery } from "./cart";
import { parseError } from "../../../helpers/error";
import { shippingAddressQuery } from "./shipping_address";
import { orderQuery } from "./order";
import { paymentOptionQuery } from "./payment";

const queries: QueryResolvers<Context> = {
    version: async (): Promise<string> => {
        return version
    },
    me: async (_, __, ___, info): Promise<ProfileResponse> => {
        try {
            // TODO: get detail if needed
            const fields = getFields(info)
            const selects = fields["user"].join(",")

            const profile = await user.getSingleUser({fields: selects })

            return {
                user: { ...profile.user }
            }
        } catch (err) {
            return parseError(err)
        }

    },
    shops: shopsQuery,
    products: productsQuery,
    cart: cartQuery,
    shippingAddress: shippingAddressQuery,
    order: orderQuery,
    paymentOption: paymentOptionQuery,
};

export default queries