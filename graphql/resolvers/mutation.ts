import { authentication } from "~encore/clients";
import { LoginResponse, MutationResolvers, UserRegisterRequest, UserRegisterResponse } from "../__generated__/resolvers-types";
import { APIError } from "encore.dev/api";

const mutations: MutationResolvers = {
    register: async (__dirname, { user }: any): Promise<UserRegisterResponse> => {
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
            const message = (err as Error).message
            const apiError = err as APIError
            return {
                response: {
                    code: apiError.code,
                    message: message,
                    success: false
                }, token: ""
            };
        }
    }
};

export default mutations;