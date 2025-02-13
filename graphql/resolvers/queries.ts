import { Context } from "../graphql";
import { APIError } from "encore.dev/api";
import { GetProfileResponse, GetShopsResponse, QueryResolvers, QueryShopsArgs } from "../__generated__/resolvers-types";
import { shop, user } from "~encore/clients";
import { verifyToken } from "../middleware";
import { GetShopParams } from "../../services/shop/shop";
import { getPagination } from "../../helpers/pagination";
import { getFields } from "../../helpers/graphql";

const queries: QueryResolvers<Context> = {
    profile: async (_, __, context: Context, info): Promise<GetProfileResponse> => {
        try {
            const userClaims = await verifyToken(context)

            // TODO: get detail if needed
            const fields = getFields(info)
            const selects = fields["user"].join(",")

            const profile = await user.getSingleUser({ username: userClaims.user_name, fields: selects })

            return {
                response: {
                    code: "success",
                    message: "data found",
                    success: true
                },
                user: {...profile.user}
            }
        } catch (err) {
            const apiError = err as APIError
            console.log(err)
            return {
                response: {
                    code: apiError.code ?? "UNKNOWN_ERROR", // Default to a non-null value
                    message: apiError.message ?? "An unknown error occurred",
                    success: false
                }
            }
        }

    },
    shops: async (_, { pagination, q }: Partial<QueryShopsArgs>, ___, info): Promise<GetShopsResponse> => {
        try {
            const req: GetShopParams = {
                limit: pagination?.limit ?? 1,
                start_key: pagination?.start_key ?? 0,
                q: q ?? "",
            }

            req.fields = (getFields(info))["shops"]?.join(",")

            const { shops, total } = await shop.getShops(req)

            if (shops.length === 0) {                
                return {
                    response: {
                        code: "success",
                        message: "data not found",
                        success: true
                    },
                    shops: [],
                    pagination: getPagination(pagination ?? {}, total)
                };
            }
            return {
                response: {
                    code: "success",
                    message: "data found",
                    success: true
                },
                shops: shops.map(shop => ({ ...shop })),
                pagination: getPagination(pagination ?? {}, total)
            };
        } catch (err) {
            const apiError = err as APIError
            console.log(err)
            return {
                response: {
                    code: apiError.code,
                    message: apiError.message,
                    success: false
                }
            }
        }
    }
};

export default queries