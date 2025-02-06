import { authentication, shop as shopClient } from "~encore/clients";
import { GetShopsResponse, LoginResponse, MutationResolvers, SaveShopRequest, Shop, UserRegisterRequest, UserRegisterResponse } from "../__generated__/resolvers-types";
import { APIError } from "encore.dev/api";
import { Context } from "../graphql";
import { verifyToken } from "../middleware";
import { UserEntity } from "../../services/user/db";

const mutations: MutationResolvers = {
    // auth
    register: async (_, { user }: any): Promise<UserRegisterResponse> => {
        try {
            const request = user as UserRegisterRequest
            const res = await authentication.register({ request })
            return {
                token: res.token
            }
        } catch (err) {
            const apiError = err as APIError
            return {
                response: {
                    code: apiError.code,
                    message: apiError.message,
                    success: false
                }, token: ""
            };
        }
    },
    login: async (_, {username, password}: {username: string, password: string}): Promise<LoginResponse> => {
        try {
            const res = await authentication.login({username, password})
            return {
                token: res.token
            }
        } catch (err) {
            const apiError = err as APIError
            return {
                response: {
                    code: apiError.code,
                    message: apiError.message,
                    success: false
                }, token: ""
            };
        }
    },
    // --end auth

    // shop
    save_shop: async(_, {shop} : any, context: Context): Promise<GetShopsResponse> => {
        try {
            const userClaims = await verifyToken(context)

            const user: UserEntity = {
                id: userClaims.user_id
            }
            const request = shop as SaveShopRequest

            const { savedShop } = await shopClient.saveShop({shop: request, user})
            return {shops: [savedShop as Shop]}
        } catch (err) {
            const apiError = err as APIError
            return {
                response: {
                    code: apiError.code,
                    message: apiError.message,
                    success: false
                }
            };
        }
    }
    // --end shop
};

export default mutations;