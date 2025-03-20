import { api, APIError } from "encore.dev/api";
import { ShippingAddressEntity, ShippingOrder, ShippingOrderEntity } from "./db";
import { getAuthData } from "~encore/auth";

export const createShippingOrder = api(
    { method: "POST", path: "/shipping-order", auth: true},
    async ({ request, orderId }: {request: ShippingAddressEntity, orderId: number}): Promise<({ shippingOrder: ShippingOrderEntity })> => {
        const authData = getAuthData()

        if (!authData) {
            throw APIError.unauthenticated("unauthenticated")
        }

        // remove fields (dang TS)
        const { id, is_favorite, updated_at, ...filteredRequest } = request;
        const addressRequest: ShippingOrderEntity = {
            ...filteredRequest,
            order_id: orderId,
            created_at: (new Date()).toISOString(),
        }

        let savedId = await ShippingOrder().insert(addressRequest, "id")

        return {shippingOrder: {
            ...addressRequest,
            id: Number(savedId[0].id)
        }}
    }
)

// TODO! delivery tracking (new table for historical progress)