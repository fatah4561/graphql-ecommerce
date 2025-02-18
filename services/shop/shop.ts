import { api, APIError, ErrCode } from "encore.dev/api"
import { ShopEntity, Shops } from "./db"
import { PaginationRequest, SaveShopRequest } from "../../graphql/__generated__/resolvers-types"
import { UserEntity } from "../user/db"
import { isValidTimeFormat } from "../../helpers/time"
import packageJson from "../../package.json"
import { getAuthData } from "~encore/auth"

export interface GetShopParams extends PaginationRequest {
    q: string
    fields?: string
    shopId?: number
    userId?: number
}

export const getShops = api(
    { method: "GET", path: "/shops" },
    async (params: GetShopParams): Promise<({ shops: ShopEntity[], total: number })> => {
        const query = Shops()

        if (params.q) {
            query.andWhere(function () {
                const q = "%" + params.q + "%"
                this.whereILike("name", q).orWhereILike("description", q)
            })
        }

        if (params.shopId) {
            query.andWhere("id", "=", params.shopId)
        }

        if (params.userId) {
            query.andWhere("user_id", "=", params.userId)
        }

        // count total
        const totalQuery = query.clone().count('id')

        // keyset pagination
        const paginationQuery = query.clone().orderBy("id", "asc")
            .where("id", ">=", params.cursor ?? 0)
            .limit(params.limit ?? 1)

        if (params.fields) {
            paginationQuery.column(params.fields.split(","))
        }

        const [totalResult, shops] = await Promise.all([
            totalQuery,
            paginationQuery.select<ShopEntity[]>()
        ])

        return {
            shops: shops.map(shop => ({
                id: shop.id,
                name: shop.name ?? "",
                user_id: shop.user_id ?? 0,
                postal_code: shop.postal_code ?? 0,
                province_id: shop.province_id ?? 0,
                coordinate: shop.coordinate ?? "",
                city_id: shop.city_id ?? 0,
                district_id: shop.district_id ?? 0,
            })),
            total: Number(totalResult[0].count)
        };

    }
)

export const getShopDetail = api(
    { method: "GET", path: "/shops:id"  },
    async ( {id}: {id: number} ): Promise<({ shop: ShopEntity })> => {
        // TODO? make it to be able to select fields
        const shop = await Shops().where("id", "=", id).
        select<ShopEntity>().
        first()

        if (!shop) {
            throw new APIError(ErrCode.NotFound, "Shop not found")
        }
        shop.id = Number(shop.id)

        return {shop};

    }
)

export const getUserShop = api(
    { method: "GET", path: "/shops/me", auth: true  },
    async (): Promise<({ shop: ShopEntity })> => {
        // TODO? make it to be able to select fields
        const authData = getAuthData()
        if (!authData) {
            throw new APIError(ErrCode.Unauthenticated, "unauthenticated")
        }

        const shop = await Shops().where("user_id", "=", authData.userID).
        select<ShopEntity>().
        first()

        if (!shop) {
            throw new APIError(ErrCode.NotFound, "Shop not found")
        }
        shop.id = Number(shop.id)

        return {shop};

    }
)

export const saveShop = api(
    { method: "POST", path: "/shop" },
    async ({ shop, user }: { shop: SaveShopRequest, user: UserEntity }): Promise<{ savedShop: ShopEntity }> => {
        // TODO file save for shop icon
        // validation
        if (!user.id) {
            throw new APIError(ErrCode.PermissionDenied, "User is empty")
        }

        if (shop.opened_at && !isValidTimeFormat(shop.opened_at)) {
            throw new APIError(ErrCode.InvalidArgument, "Invalid time format for opened_at")
        }
        shop.opened_at = shop.opened_at ? shop.opened_at + packageJson["app-config"].timezone : "00:00:00+0000"

        if (shop.closed_at && !isValidTimeFormat(shop.closed_at)) {
            throw new APIError(ErrCode.InvalidArgument, "Invalid time format for opened_at")
        }
        shop.closed_at = shop.closed_at ? shop.closed_at + packageJson["app-config"].timezone : "00:00:00+0000"
        // --end validation

        const shopRequest: ShopEntity = {
            user_id: user.id ?? 0,

            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),

            ...shop
        }

        const savedShop = (await Shops().insert(shopRequest, "*").onConflict("user_id").merge())[0]
        return { savedShop }
    }
)
