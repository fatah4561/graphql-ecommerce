import { Context, version } from "../graphql";
import { APIError, ErrCode } from "encore.dev/api";
import { ProfileResponse, ShopsResponse, QueryResolvers, QueryShopsArgs, QueryProductsArgs, ProductsResponse } from "../__generated__/resolvers-types";
import { product, shop, user } from "~encore/clients";
import { GetShopParams } from "../../services/shop/shop";
import { getPagination } from "../../helpers/pagination";
import { getFields } from "../../helpers/graphql";
import { GetProductParams } from "../../services/product/product";

const queries: QueryResolvers<Context> = {
    version: async (): Promise<string> => {
        return version
    },
    me: async (_, __, ___, info): Promise<ProfileResponse> => {
        try {
            // TODO: get detail if needed
            const fields = getFields(info)
            const selects = fields["user"].join(",")

            const profile = await user.getSingleUser({fields: selects })

            return {
                user: { ...profile.user }
            }
        } catch (err) {
            const apiError = err as APIError
            return {
                code: apiError.code ?? "UNKNOWN_ERROR", // Default to a non-null value
                message: apiError.message ?? "An unknown error occurred",
            }
        }

    },
    // shop
    shops: async (_, { pagination, q, shopId, userId }: Partial<QueryShopsArgs>, ___, info): Promise<ShopsResponse> => {
        try {
            const req: GetShopParams = {
                limit: pagination?.limit ?? 1,
                cursor: pagination?.cursor ?? 1,
                q: q ?? "",
                shopId: shopId ?? undefined,
                userId: userId ?? undefined,
            }

            req.fields = (getFields(info))["shops"]?.join(",")

            const { shops, total } = await shop.getShops(req)

            if (shops.length === 0) {
                throw new APIError(ErrCode.NotFound, "data not found")
            }

            return {
                shops: shops.map(shop => ({ ...shop })),
                pagination: getPagination(pagination ?? { cursor: 1 }, total)
            };
        } catch (err) {
            const apiError = err as APIError
            return {
                code: apiError.code,
                message: apiError.message,
            }
        }
    },
    // products
    products: async (_, { pagination, q, shopId, productId }: Partial<QueryProductsArgs>, ___, info): Promise<ProductsResponse> => {
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
                throw new APIError(ErrCode.NotFound, "data not found")
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
    },
};

export default queries