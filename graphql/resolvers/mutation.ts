import { authentication, shop, shop as shopClient, product as productClient } from "~encore/clients";
import { ShopsResponse, AuthResponse, MutationResolvers, SaveShopRequest, Shop, UserRegisterRequest, SaveProductResponse, SaveProductRequest, MutationDeleteProductArgs, ErrorResponse } from "../__generated__/resolvers-types";
import { APIError, ErrCode } from "encore.dev/api";
import { Context } from "../graphql";
import { verifyToken } from "../middleware";
import { UserEntity } from "../../services/user/db";

const mutations: MutationResolvers = {
    // auth
    register: async (_, { user }: any): Promise<AuthResponse> => {
        try {
            const request = user as UserRegisterRequest
            const res = await authentication.register({ request })
            return { jwt: res.token }
        } catch (err) {
            const apiError = err as APIError
            return {
                code: apiError.code,
                message: apiError.message,
            };
        }
    },
    login: async (_, { username, password }: { username: string, password: string }): Promise<AuthResponse> => {
        try {
            const res = await authentication.login({ username, password })
            return { jwt: res.token }
        } catch (err) {
            const apiError = err as APIError
            return {
                code: apiError.code,
                message: apiError.message,
            };
        }
    },
    // --end auth

    // shop
    saveShop: async (_, { shop }: any, context: Context): Promise<ShopsResponse> => {
        try {
            const userClaims = await verifyToken(context)

            const user: UserEntity = {
                id: userClaims.user_id
            }
            const request = shop as SaveShopRequest

            const { savedShop } = await shopClient.saveShop({ shop: request, user })
            return { shops: [savedShop as Shop] }
        } catch (err) {
            const apiError = err as APIError
            return {
                code: apiError.code,
                message: apiError.message,
            };
        }
    },
    // --end shop

    // product
    saveProduct: async (_, { product }: any, context: Context): Promise<SaveProductResponse> => {
        try {
            const userClaims = await verifyToken(context)

            const userId = userClaims?.user_id

            if (!userId) {
                throw new APIError(ErrCode.Unauthenticated, "Please login first")
            }

            const userShop = await shop.getShops({ q: "", cursor: 1, userId, fields: "id" });
            if (userShop?.shops?.length == 0 || !userShop.shops[0].id) {
                throw new APIError(ErrCode.FailedPrecondition, "Please create a shop first")
            }

            const request = product as SaveProductRequest

            const { savedProduct } = await productClient.saveProduct({ product: request, shopId: userShop.shops[0].id, userId })
            return { ...savedProduct }
        } catch (err) {
            const apiError = err as APIError
            return {
                code: apiError.code,
                message: apiError.message,
            };
        }
    },

    deleteProduct: async(_, { id }: Partial<MutationDeleteProductArgs>, context, info): Promise<ErrorResponse> => {

        try {
            const userClaims = await verifyToken(context)

            const userId = userClaims?.user_id

            if (!userId) {
                throw new APIError(ErrCode.Unauthenticated, "Please login first")
            }

            if (!id) {
                throw new APIError(ErrCode.InvalidArgument, "Please check the argument")
            }

            const isProductOwner = await productClient.isProductOwner({id, userId})
            if (!isProductOwner.isOwner) {
                throw new APIError(ErrCode.NotFound, "Product not found") // obfuscation -.-
            }

            await productClient.deleteProduct({id, userId})

            return {code: "", message:""}
        } catch(err) {
            const apiError = err as APIError
            return {
                code: apiError.code,
                message: apiError.message,
            };
        }
    }

    // --end product
};

export default mutations;