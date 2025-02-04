import { Context } from "../graphql";
import { APIError } from "encore.dev/api";
import { QueryResolvers, User } from "../__generated__/resolvers-types";
import { user } from "~encore/clients";
import { parseResolveInfo } from "graphql-parse-resolve-info";
import { verifyToken } from "../middleware";

const queries: QueryResolvers<Context> = {
    profile: async(_, __, context: Context, info): Promise<User> => {
        try {
            const userClaims = await verifyToken(context)

            let selects: string[] | undefined = undefined
            const parsedResolveInfo = parseResolveInfo(info)
            if (parsedResolveInfo) {
                // TODO: get detail if needed
                selects = (Object.keys(parsedResolveInfo.fieldsByTypeName.User)).filter((field) => field !== 'response' && field != "details");
            }

            const profile = await user.getSingleUser({username: userClaims.user_name, fields: selects})

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
};

export default queries