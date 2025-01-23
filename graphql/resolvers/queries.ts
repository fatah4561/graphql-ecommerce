import { Context } from "../graphql";
import { APIError } from "encore.dev/api";
import { QueryResolvers, User } from "../__generated__/resolvers-types";

const queries: QueryResolvers<Context> = {
    profile: async(): Promise<User> => {
        return {fullname: "aw man"}
    },
};

export default queries