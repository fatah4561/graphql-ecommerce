import { MutationResolvers } from "../../__generated__/resolvers-types";
import { registerMutation, loginMutation } from "./auth";
import { addToCartMutation } from "./cart";
import { saveProductMutation, deleteProductMutation } from "./product";
import { saveShopMutation } from "./shop";

const mutations: MutationResolvers = {
    register: registerMutation,
    login: loginMutation,

    saveShop: saveShopMutation,

    saveProduct: saveProductMutation,
    deleteProduct: deleteProductMutation,

    addToCart: addToCartMutation,
};

export default mutations;