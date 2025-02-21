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