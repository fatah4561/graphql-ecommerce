import { api, APIError, ErrCode } from "encore.dev/api"
import { ShopEntity, Shops } from "./db"
import { PaginationRequest, SaveShopRequest } from "../../graphql/__generated__/resolvers-types"
import { UserEntity } from "../user/db"
import { isValidTimeFormat } from "../../helpers/time"
import packageJson from "../../package.json"

export const getShops = api(
    { method: "GET", path: "/shops" },
    async ({ pagination, q, fields }: { pagination: PaginationRequest, q: string, fields?: Array<string> }): Promise<({ shops: Array<ShopEntity> })> => {

        // keyset pagination
        const query = Shops()
            .orderBy("id", "asc")
            .where("id", ">", pagination.start_key ?? 0)
            .limit(pagination.limit ?? 1)

        // search
        if (q) {
            query.andWhere(function () {
                this.whereILike("name", q ?? "").orWhereILike("description", q ?? "")
            })
        }

        if (fields) {
            query.column(fields)
        }

        const shops: ShopEntity[] = await query.select<ShopEntity[]>()
        return { shops }
    }
)

export const saveShop = api(
    { method: "POST", path: "/shop" },
    async ({ shop, user }: { shop: SaveShopRequest, user: UserEntity }): Promise<{ savedShop: ShopEntity }> => {
        // TODO file save for shop icon
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