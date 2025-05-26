import { Resolvers } from "../__generated__/resolvers-types"
import Query from "./queries/index"
import Mutation from "./mutations/index"
import * as resolve_type from "./resolve_type";

const resolvers: Resolvers = {
    // action
    Query,
    Mutation,

    // union response resolver
    AuthResponse: resolve_type.authResponseResolver,

    ShopsResponse: resolve_type.shopsResponseResolver,

    ProfileResponse: resolve_type.profileResponseResolver,

    ProductsResponse: resolve_type.productsResponseResolver,
    SaveProductResponse: resolve_type.saveProductResolver,

    CartsResponse: resolve_type.cartsResponseResolver,
    AddToCartResponse: resolve_type.addToCartResponseResolver,

    SaveShippingAddressResponse: resolve_type.saveShippingAddressResponseResolver,
    ShippingAddressResponse: resolve_type.shippingAddressResponseResolver,

    OrdersResponse: resolve_type.ordersResponseResolver,

    PaymentOptionResponse: resolve_type.paymentOptionResponseResolver,
};

export default resolvers;