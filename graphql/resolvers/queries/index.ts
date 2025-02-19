import { APIError } from "encore.dev/api";
import { user } from "~encore/clients";
import { getFields } from "../../../helpers/graphql";
import { QueryResolvers, ProfileResponse } from "../../__generated__/resolvers-types";
import { productsQuery } from "./product";
import { shopsQuery } from "./shop";
import { Context, version } from "../../graphql";

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
            const apiError = err as APIError
            return {
                code: apiError.code ?? "UNKNOWN_ERROR", // Default to a non-null value
                message: apiError.message ?? "An unknown error occurred",
            }
        }

    },
    shops: shopsQuery,
    products: productsQuery,
};

export default queries