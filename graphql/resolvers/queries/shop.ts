import { APIError } from "encore.dev/api"
import { shop } from "~encore/clients"
import { getFields } from "../../../helpers/graphql"
import { getPagination } from "../../../helpers/pagination"
import { GetShopParams } from "../../../services/shop/shop"
import { QueryResolvers, QueryShopsArgs, ShopsResponse } from "../../__generated__/resolvers-types"
import { parseError } from "../../../helpers/error"

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
            throw APIError.notFound("data not found")
        }

        return {
            shops: shops.map(shop => ({ ...shop })),
            pagination: getPagination(pagination ?? { cursor: 1 }, total)
        };
    } catch (err) {
        return parseError(err)
    }
}