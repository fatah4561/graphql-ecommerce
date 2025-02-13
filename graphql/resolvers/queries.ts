import { Context } from "../graphql";
import { APIError } from "encore.dev/api";
import { GetShopsResponse, QueryResolvers, QueryShopsArgs, User } from "../__generated__/resolvers-types";
import { shop, user } from "~encore/clients";
import { parseResolveInfo, ResolveTree } from "graphql-parse-resolve-info";
import { verifyToken } from "../middleware";
import { GetShopParams } from "../../services/shop/shop";
import { getPagination } from "../../helpers/pagination";

const queries: QueryResolvers<Context> = {
    profile: async (_, __, context: Context, info): Promise<User> => {
        try {
            const userClaims = await verifyToken(context)

            let selects: string[] | undefined = undefined
            const parsedResolveInfo = parseResolveInfo(info)
            if (parsedResolveInfo) {
                // TODO: get detail if needed
                selects = (Object.keys(parsedResolveInfo.fieldsByTypeName.User)).filter((field) => field !== 'response' && field != "details");
            }

            const profile = await user.getSingleUser({ username: userClaims.user_name, fields: selects?.join(",") })

            return {
                response: {
                    code: "success",
                    message: "data found",
                    success: true
                },
                ...profile.user
            }
        } catch (err) {
            const apiError = err as APIError
            return {
                response: {
                    code: apiError.code,
                    message: apiError.message,
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

            const parsedResolveInfo = parseResolveInfo(info)
            if (parsedResolveInfo) {
                const getShopsResponse = parsedResolveInfo.fieldsByTypeName.GetShopsResponse as Record<string, ResolveTree>;

                if ("shops" in getShopsResponse) {
                    req.fields = (Object.keys(getShopsResponse.shops.fieldsByTypeName.Shop)).join(",");
                }
            }

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