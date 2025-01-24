import { Context } from "../graphql";
import { APIError, ErrCode } from "encore.dev/api";
import { QueryResolvers, User } from "../__generated__/resolvers-types";
import { authentication, user } from "~encore/clients";

const queries: QueryResolvers<Context> = {
    profile: async(_, __, context: Context): Promise<User> => {
        try {
            const userClaims = await authentication.verify({token: context.token?? ""})

            if (!userClaims) {
                const apiError = new APIError(ErrCode.Unauthenticated, "unauthenticated")
                return {
                    response: {
                        code: apiError.code,
                        message: apiError.message,
                        success: false
                    }
                }
            }

            const profile = await user.getSingleUser({username: userClaims.claims.user_name})

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