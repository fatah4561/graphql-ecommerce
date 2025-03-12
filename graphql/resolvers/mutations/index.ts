import { MutationResolvers } from "../../__generated__/resolvers-types";
import { registerMutation, loginMutation } from "./auth";
import { addToCartMutation, deleteFromCartMutation, updateCartQtyMutation } from "./cart";
import { saveProductMutation, deleteProductMutation } from "./product";
import { saveShippingAddressMutation } from "./shipping_address";
import { saveShopMutation } from "./shop";

const mutations: MutationResolvers = {
    register: registerMutation,
    login: loginMutation,

    saveShop: saveShopMutation,

    saveProduct: saveProductMutation,
    deleteProduct: deleteProductMutation,

    addToCart: addToCartMutation,
    updateCartQty: updateCartQtyMutation,
    deleteFromCart: deleteFromCartMutation,

    saveShippingAddress: saveShippingAddressMutation,
};

export default mutations;