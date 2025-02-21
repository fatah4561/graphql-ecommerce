import { authentication } from "~encore/clients";
import { AuthResponse, MutationResolvers, UserRegisterRequest } from "../../__generated__/resolvers-types";
import { parseError } from "../../../helpers/error";

export const registerMutation: MutationResolvers["register"] = async (_, { user }: any): Promise<AuthResponse> => {
    try {
        const request = user as UserRegisterRequest
        const res = await authentication.register({ request })
        return { jwt: res.token }
    } catch (err) {
        return parseError(err)
    }
}

export const loginMutation: MutationResolvers["login"] = async (_, { username, password }: { username: string, password: string }): Promise<AuthResponse> => {
    try {
        const res = await authentication.login({ username, password })
        return { jwt: res.token }
    } catch (err) {
        return parseError(err)
    }
}