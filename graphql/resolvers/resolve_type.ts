import { Resolvers } from "../__generated__/resolvers-types";

export const authResponseResolver: Resolvers["AuthResponse"] = {
    __resolveType(obj) {
        if ("jwt" in obj) {
            return "Token";
        }
        if ("message" in obj) {
            return "ErrorResponse";
        }
        return null;
    },
};

export const shopsResponseResolver: Resolvers["ShopsResponse"] = {
    __resolveType(obj) {
        if ("message" in obj && "code" in obj) {
            return "ErrorResponse";
        }
        return "ShopList";
    },
}

export const profileResponseResolver: Resolvers["ProfileResponse"] = {
    __resolveType(obj) {
        if ("message" in obj && "code" in obj) {
            return "ErrorResponse";
        }
        return "UserSingleResult";
    },
}

export const productsResponseResolver: Resolvers["ProductsResponse"] = {
    __resolveType(obj) {
        if ("message" in obj && "code" in obj) {
            return "ErrorResponse";
        }
        return "ProductList";
    },
}

export const saveProductResolver: Resolvers["SaveProductResponse"] = {
    __resolveType(obj) {
        if ("message" in obj && "code" in obj) {
            return "ErrorResponse";
        }
        return "Product";
    },
}

export const cartsResponseResolver: Resolvers["CartsResponse"] = {
    __resolveType(obj) {
        if ("message" in obj && "code" in obj) {
            return "ErrorResponse";
        }
        return "CartList";
    },
}

export const addToCartResponseResolver: Resolvers["AddToCartResponse"] = {
    __resolveType(obj) {
        if ("message" in obj && "code" in obj) {
            return "ErrorResponse";
        }
        return "Cart";
    },
}

export const saveShippingAddressResponseResolver: Resolvers["SaveShippingAddressResponse"] = {
    __resolveType(obj) {
        if ("message" in obj && "code" in obj) {
            return "ErrorResponse";
        }
        return "ShippingAddress";
    }
}

export const shippingAddressResponseResolver: Resolvers["ShippingAddressResponse"] = {
    __resolveType(obj) {
        if ("message" in obj && "code" in obj) {
            return "ErrorResponse";
        }
        return "ShippingAddressList";
    }
}

export const ordersResponseResolver: Resolvers["OrdersResponse"] = {
    __resolveType(obj) {
        if ("message" in obj && "code" in obj) {
            return "ErrorResponse";
        }

        if ("orders" in obj && Array.isArray(obj.orders)) {
            return "OrderList";
        }

        if ("id" in obj) {
            return "Order";
        }

        return null;
    }
}

export const paymentOptionResponseResolver: Resolvers["PaymentOptionResponse"] = {
    __resolveType(obj) {
        if ("message" in obj && "code" in obj) {
            return "ErrorResponse";
        }

        return "PaymentOptionList";
    }
}