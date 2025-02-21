import { APIError, ErrCode } from "encore.dev/api";
import { shop as shopClient, product as productClient } from "~encore/clients";
import { ErrorResponse, MutationDeleteProductArgs, MutationResolvers, SaveProductRequest, SaveProductResponse } from "../../__generated__/resolvers-types";
import { getAuthData } from "~encore/auth";
import { parseError } from "../../../helpers/error";

export const saveProductMutation: MutationResolvers["saveProduct"] = async (_, { product }: any): Promise<SaveProductResponse> => {
    try {
        const userShop = await shopClient.getUserShop().catch(err => {
            const error = err as APIError
            if (error.code == ErrCode.Unauthenticated) {
                throw  APIError.unauthenticated("Please login first")
            }
            throw error
        });

        if (!userShop) {
            throw APIError.failedPrecondition("Please create a shop first")
        }

        const request = product as SaveProductRequest

        const { savedProduct } = await productClient.saveProduct({ 
            product: request, 
            shopId: Number(userShop.shop.id),
        })
        return { ...savedProduct }
    } catch (err) {
        return parseError(err)
    }
}

export const deleteProductMutation: MutationResolvers["deleteProduct"] = async(_, { id }: Partial<MutationDeleteProductArgs>, __, ___): Promise<ErrorResponse> => {
    try {
        const authData = getAuthData()

        if (!authData) {
            throw APIError.unauthenticated("Please login first")
        }

        if (!id) {
            throw APIError.invalidArgument("Please check the argument")
        }

        const isProductOwner = await productClient.isProductOwner({id, userId: Number(authData.userID)})
        if (!isProductOwner.isOwner) {
            throw APIError.notFound("Product not found") // obfuscation -.-
        }

        await productClient.deleteProduct({id})

        return {code: "", message:""}
    } catch(err) {
        return parseError(err)
    }
}