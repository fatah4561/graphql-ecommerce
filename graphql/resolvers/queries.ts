import { Context } from "../graphql";
import { APIError, ErrCode } from "encore.dev/api";
import { QueryResolvers, User } from "../__generated__/resolvers-types";
import { authentication, user } from "~encore/clients";
import { parseResolveInfo } from "graphql-parse-resolve-info";
import { Claims } from "../../authentication/authentication";

const queries: QueryResolvers<Context> = {
    profile: async(_, __, context: Context, info): Promise<User> => {
        // TODO: make better & reusable middleware
        let userClaims: Claims | undefined = undefined
        try {
            userClaims = (await authentication.verify({token: context.token?? ""})).claims

            if (!userClaims) {
                throw new APIError(ErrCode.Unauthenticated, "unauthenticated")
            }
        } catch (_) {
            return {
                response: {
                    code: ErrCode.Unauthenticated,
                    message: "unauthenticated",
                    success: false
                }
            }
        }

        try {
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