import { MutationResolvers, UserRegisterResponse } from "../__generated__/resolvers-types";
import { APIError } from "encore.dev/api";

const mutations: MutationResolvers = {
    register: async(_, {user}): Promise<UserRegisterResponse>  => {
        return {response: {
            code: "",
            message: "",
            success: true
        }, token: "jwtjwtjwt"};
    }
};

export default mutations;