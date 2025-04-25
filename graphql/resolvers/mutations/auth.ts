import {
    authentication as authenticationClient,
    shop as shopClient,
} from "~encore/clients";
import { generateToken } from "../../../services/authentication/authentication";
import { AuthResponse, MutationResolvers, UserRegisterRequest } from "../../__generated__/resolvers-types";
import { parseError } from "../../../helpers/error";
import { APIError } from "encore.dev/api";

export const registerMutation: MutationResolvers["register"] = async (_, { user }: any): Promise<AuthResponse> => {
    try {
        const request = user as UserRegisterRequest
        const res = await authenticationClient.register({ request })
        return { jwt: res.token }
    } catch (err) {
        return parseError(err)
    }
}

export const loginMutation: MutationResolvers["login"] = async (_, { username, password }: { username: string, password: string }): Promise<AuthResponse> => {
    try {
        const { user } = await authenticationClient.login({ username, password })
        if (!user || !user.id) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        const { shop } = await shopClient.getShopByUserId({ id: user.id })
        const jwt = await generateToken(user, shop)

        return { jwt }
    } catch (err) {
        return parseError(err)
    }
}