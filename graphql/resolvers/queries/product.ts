import { APIError, ErrCode } from "encore.dev/api";
import { shop, product } from "~encore/clients";
import { getFields } from "../../../helpers/graphql";
import { getPagination } from "../../../helpers/pagination";
import { GetProductParams } from "../../../services/product/product";
import { ProductsResponse, QueryProductsArgs, QueryResolvers } from "../../__generated__/resolvers-types";

export const productsQuery: QueryResolvers["products"] = async (_, { pagination, q, shopId, productId }: Partial<QueryProductsArgs>, ___, info): Promise<ProductsResponse> => {
    try {
        const req: GetProductParams = {
            limit: pagination?.limit ?? 1,
            cursor: pagination?.cursor ?? 1,
            q: q ?? "",
            shopId: shopId ?? undefined,
            productId: productId ?? undefined,
            isOwner: false
        }

        // check if owner of shop (auto auth dang encore.ts GG)
        const userShop = await shop.getUserShop().catch(error => console.log(error))
        if (userShop) {
            if(userShop.shop.user_id == shopId) {req.isOwner = true}
        }

        req.fields = (getFields(info))["products"]?.join(",")

        const { products, total } = await product.getProducts(req)

        if (products.length === 0) {
            throw APIError.notFound("data not found")
        }

        return {
            products: products.map(product => ({ 
                ...product 
            })),
            pagination: getPagination(pagination ?? { cursor: 1 }, total)
        };
    } catch (err) {
        const apiError = err as APIError
        return {
            code: apiError.code,
            message: apiError.message,
        }
    }
}