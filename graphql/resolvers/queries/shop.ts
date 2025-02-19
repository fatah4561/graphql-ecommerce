import { APIError, ErrCode } from "encore.dev/api"
import { shop } from "~encore/clients"
import { getFields } from "../../../helpers/graphql"
import { getPagination } from "../../../helpers/pagination"
import { GetShopParams } from "../../../services/shop/shop"
import { QueryResolvers, QueryShopsArgs, ShopsResponse } from "../../__generated__/resolvers-types"

export const shopsQuery: QueryResolvers["shops"] = async (_, { pagination, q, shopId, userId }: Partial<QueryShopsArgs>, ___, info): Promise<ShopsResponse> => {
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
}