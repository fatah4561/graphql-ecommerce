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