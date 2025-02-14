import { Context, version } from "../graphql";
import { APIError, ErrCode } from "encore.dev/api";
import { ProfileResponse, ShopsResponse, QueryResolvers, QueryShopsArgs, QueryProductsArgs, ProductsResponse } from "../__generated__/resolvers-types";
import { product, shop, user } from "~encore/clients";
import { verifyToken } from "../middleware";
import { GetShopParams } from "../../services/shop/shop";
import { getPagination } from "../../helpers/pagination";
import { getFields } from "../../helpers/graphql";
import { GetProductParams } from "../../services/product/product";

const queries: QueryResolvers<Context> = {
    version: async (): Promise<string> => {
        return version
    },
    me: async (_, __, context: Context, info): Promise<ProfileResponse> => {
        try {
            const userClaims = await verifyToken(context)

            // TODO: get detail if needed
            const fields = getFields(info)
            const selects = fields["user"].join(",")

            const profile = await user.getSingleUser({ username: userClaims.user_name, fields: selects })

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
    products: async (_, { pagination, q, shopId, productId }: Partial<QueryProductsArgs>, context, info): Promise<ProductsResponse> => {
        try {
            const req: GetProductParams = {
                limit: pagination?.limit ?? 1,
                cursor: pagination?.cursor ?? 1,
                q: q ?? "",
                shopId: shopId ?? undefined,
                productId: productId ?? undefined,
                isOwner: false
            }

            // check if owner of shop
            if (shopId) { // TODO? make it simpler by using single data service
                try { // ignore fail auth
                    const userClaims = await verifyToken(context);
                    const userId = userClaims?.user_id;
                
                    if (userId) {
                        const userShop = await shop.getShops({ q: "", cursor: 1, userId, fields: "id" });
                
                        if (userShop?.shops?.length === 1 && userShop.shops[0].id === shopId) {
                            req.isOwner = true;
                        }
                    }
                } catch (_) {
                    req.isOwner = false
                }
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