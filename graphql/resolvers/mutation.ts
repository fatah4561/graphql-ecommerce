import { authentication, shop, shop as shopClient, product as productClient } from "~encore/clients";
import { ShopsResponse, AuthResponse, MutationResolvers, SaveShopRequest, Shop, UserRegisterRequest, SaveProductResponse, SaveProductRequest, MutationDeleteProductArgs, ErrorResponse } from "../__generated__/resolvers-types";
import { APIError, ErrCode } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

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
    saveShop: async (_, { shop }: any): Promise<ShopsResponse> => {
        try {
            const request = shop as SaveShopRequest
            const { savedShop } = await shopClient.saveShop({ shop: request })
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
    saveProduct: async (_, { product }: any): Promise<SaveProductResponse> => {
        try {
            const userShop = await shop.getUserShop().catch(err => {
                const error = err as APIError
                if (error.code == ErrCode.Unauthenticated) {
                    throw new APIError(ErrCode.Unauthenticated, "Please login first")
                }
                throw error
            });

            if (!userShop) {
                throw new APIError(ErrCode.FailedPrecondition, "Please create a shop first")
            }

            const request = product as SaveProductRequest

            const { savedProduct } = await productClient.saveProduct({ 
                product: request, 
                shopId: Number(userShop.shop.id),
            })
            return { ...savedProduct }
        } catch (err) {
            const apiError = err as APIError
            return {
                code: apiError.code,
                message: apiError.message,
            };
        }
    },

    deleteProduct: async(_, { id }: Partial<MutationDeleteProductArgs>, __, ___): Promise<ErrorResponse> => {
        try {
            const authData = getAuthData()

            if (!authData) {
                throw new APIError(ErrCode.Unauthenticated, "Please login first")
            }

            if (!id) {
                throw new APIError(ErrCode.InvalidArgument, "Please check the argument")
            }

            const isProductOwner = await productClient.isProductOwner({id, userId: Number(authData.userID)})
            if (!isProductOwner.isOwner) {
                throw new APIError(ErrCode.NotFound, "Product not found") // obfuscation -.-
            }

            await productClient.deleteProduct({id})

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