import { authentication, shop as shopClient } from "~encore/clients";
import { ShopsResponse, AuthResponse, MutationResolvers, SaveShopRequest, Shop, UserRegisterRequest } from "../__generated__/resolvers-types";
import { APIError } from "encore.dev/api";
import { Context } from "../graphql";
import { verifyToken } from "../middleware";
import { UserEntity } from "../../services/user/db";

const mutations: MutationResolvers = {
    // auth
    register: async (_, { user }: any): Promise<AuthResponse> => {
        try {
            const request = user as UserRegisterRequest
            const res = await authentication.register({ request })
            return { jwt: res.token }
        } catch (err) {
            const apiError = err as APIError
            return {
                code: apiError.code,
                message: apiError.message,
            };
        }
    },
    login: async (_, { username, password }: { username: string, password: string }): Promise<AuthResponse> => {
        try {
            const res = await authentication.login({ username, password })
            return { jwt: res.token }
        } catch (err) {
            const apiError = err as APIError
            return {
                code: apiError.code,
                message: apiError.message,
            };
        }
    },
    // --end auth

    // shop
    saveShop: async (_, { shop }: any, context: Context): Promise<ShopsResponse> => {
        try {
            const userClaims = await verifyToken(context)

            const user: UserEntity = {
                id: userClaims.user_id
            }
            const request = shop as SaveShopRequest

            const { savedShop } = await shopClient.saveShop({ shop: request, user })
            return { shops: [savedShop as Shop] }
        } catch (err) {
            const apiError = err as APIError
            return {
                code: apiError.code,
                message: apiError.message,
            };
        }
    }
    // --end shop
};

export default mutations;