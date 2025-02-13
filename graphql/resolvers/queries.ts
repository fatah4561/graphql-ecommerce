import { Context, version } from "../graphql";
import { APIError, ErrCode } from "encore.dev/api";
import { ProfileResponse, ShopsResponse, QueryResolvers, QueryShopsArgs } from "../__generated__/resolvers-types";
import { shop, user } from "~encore/clients";
import { verifyToken } from "../middleware";
import { GetShopParams } from "../../services/shop/shop";
import { getPagination } from "../../helpers/pagination";
import { getFields } from "../../helpers/graphql";

const queries: QueryResolvers<Context> = {
    version: async (): Promise<string> => {
        return version
    },
    me: async (_, __, context: Context, info): Promise<ProfileResponse> => {
        try {
            const userClaims = await verifyToken(context)

            // TODO: get detail if needed
            const fields = getFields(info)
            const selects = fields["user"].join(",")

            const profile = await user.getSingleUser({ username: userClaims.user_name, fields: selects })

            return {
                user: { ...profile.user }
            }
        } catch (err) {
            const apiError = err as APIError
            console.log(err)
            return {
                code: apiError.code ?? "UNKNOWN_ERROR", // Default to a non-null value
                message: apiError.message ?? "An unknown error occurred",
            }
        }

    },
    shops: async (_, { pagination, q }: Partial<QueryShopsArgs>, ___, info): Promise<ShopsResponse> => {
        try {
            const req: GetShopParams = {
                limit: pagination?.limit ?? 1,
                cursor: pagination?.cursor ?? 0,
                q: q ?? "",
            }

            req.fields = (getFields(info))["shops"]?.join(",")

            const { shops, total } = await shop.getShops(req)

            if (shops.length === 0) {
                throw new APIError(ErrCode.NotFound, "data not found")
            }

            return {
                shops: shops.map(shop => ({ ...shop })),
                pagination: getPagination(pagination ?? { cursor: 1 }, total)
            };
        } catch (err) {
            const apiError = err as APIError
            return {
                code: apiError.code,
                message: apiError.message,
            }
        }
    }
};

export default queries