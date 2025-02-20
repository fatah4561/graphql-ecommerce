import { Resolvers } from "../__generated__/resolvers-types"
import Query from "./queries/index"
import Mutation from "./mutations/index"
import {authResponseResolver, cartsResponseResolver, productsResponseResolver, profileResponseResolver, saveProductResolver, shopsResponseResolver} from "./resolve_type";

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
    CartsResponse: cartsResponseResolver,
};

export default resolvers;