import { Resolvers } from "../__generated__/resolvers-types"
import Query from "./queries"
import Mutation from "./mutation"
import {authResponseResolver, productsResponseResolver, profileResponseResolver, saveProductResolver, shopsResponseResolver} from "./resolve_type";

const resolvers: Resolvers = {
    Query,
    Mutation,
    AuthResponse: authResponseResolver,
    ShopsResponse: shopsResponseResolver,
    ProfileResponse: profileResponseResolver,
    ProductsResponse: productsResponseResolver,
    SaveProductResponse: saveProductResolver,
};

export default resolvers;