import { Resolvers } from "../__generated__/resolvers-types"
import Query from "./queries/index"
import Mutation from "./mutations/index"
import {authResponseResolver, productsResponseResolver, profileResponseResolver, saveProductResolver, shopsResponseResolver} from "./resolve_type";

const resolvers: Resolvers = {
    // action
    Query,
    Mutation,

    // union response resolver
    AuthResponse: authResponseResolver,
    ShopsResponse: shopsResponseResolver,
    ProfileResponse: profileResponseResolver,
    ProductsResponse: productsResponseResolver,
    SaveProductResponse: saveProductResolver,
};

export default resolvers;