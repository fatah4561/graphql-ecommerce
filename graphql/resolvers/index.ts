import { Resolvers } from "../__generated__/resolvers-types"
import Query from "./queries"
import Mutation from "./mutation"
import {authResponseResolver, profileResponseResolver, shopsResponseResolver} from "./resolve_type";

const resolvers: Resolvers = {
    Query,
    Mutation,
    AuthResponse: authResponseResolver,
    ShopsResponse: shopsResponseResolver,
    ProfileResponse: profileResponseResolver,
};

export default resolvers;