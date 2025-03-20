import { api, APIError } from "encore.dev/api"
import { ShippingAddressEntity, ShippingAddresses } from "./db"
import { getAuthData } from "~encore/auth"
import { SaveShippingAddressRequest } from "../../graphql/__generated__/resolvers-types"

export const getUserShippingAddresses = api(
    { method: "GET", path: "/shipping-address", auth: true },
    async ({ fields }: { fields: string }): Promise<({ shippingAddresses: ShippingAddressEntity[] })> => {
        const authData = getAuthData()

        const query = ShippingAddresses().where("user_id", authData?.userID)
        if (fields) {
            query.column(["user_id", ...fields.split(",")])
        }

        const shippingAddresses = await query.select<ShippingAddressEntity[]>()

        return {
            shippingAddresses: shippingAddresses.map(shippingAddress => ({
                ...shippingAddress,
                id: Number(shippingAddress.id)
            }))
        }
    }
)

export const getUserFavoriteShippingAddress = api(
    { method: "GET", path: "/shipping-address/favorite", auth: true },
    async (): Promise<({ shippingAddress: ShippingAddressEntity })> => {
        const authData = getAuthData()
        const query = ShippingAddresses().where("user_id", authData?.userID).
            where("is_favorite", true)

        const shippingAddress = await query.select<ShippingAddressEntity>().first()

        if (!shippingAddress) {
            throw APIError.notFound("No favorite address found")
        }
        shippingAddress.id = Number(shippingAddress?.id)

        return { shippingAddress }
    }
)

export const getUserSingleShippingAddress = api(
    { method: "GET", path: "/shipping-address/:id", auth: true },
    async ({ id }: { id: number }): Promise<({ shippingAddress: ShippingAddressEntity })> => {
        const authData = getAuthData()
        const shippingAddress = await ShippingAddresses().where("user_id", authData?.userID).
            andWhere("id", "=", id).
            select<ShippingAddressEntity>().first()

        if (!shippingAddress) {
            throw APIError.notFound("No favorite address found")
        }
        shippingAddress.id = Number(shippingAddress?.id)

        return { shippingAddress }
    }
)

export const saveShippingAddress = api(
    { method: "POST", path: "/shipping-address", auth: true },
    async ({ shippingAddress }: { shippingAddress: SaveShippingAddressRequest }): Promise<({ shippingAddress: ShippingAddressEntity })> => {
        const authData = getAuthData()

        if (!shippingAddress.id) {
            shippingAddress.id = undefined
        }

        const addressRequest: ShippingAddressEntity = {
            user_id: Number(authData?.userID),

            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),

            ...shippingAddress
        }

        let savedAddress = (await ShippingAddresses().insert(addressRequest, "*").onConflict("id").merge())[0]
        savedAddress.id = Number(savedAddress.id)
        return { shippingAddress: savedAddress }
    }
)

export const unsetFavoriteShippingAddress = api(
    { method: "PUT", path: "/shipping-address/unset-favorite", auth: true },
    async () => {
        const authData = getAuthData()

        await ShippingAddresses().where("user_id", Number(authData?.userID)).
            update({
                is_favorite: false,
                updated_at: (new Date()).toISOString(),
            })
        return
    }
)