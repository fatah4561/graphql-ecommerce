import { api, APIError } from "encore.dev/api";
import { CartEntity, Carts } from "./db";
import { getAuthData } from "~encore/auth";
import { AddToCartRequest } from "../../graphql/__generated__/resolvers-types";

// TODO?: maybe do something about the auth / session checking so i don't repeat them like this
export const getCarts = api(
    { method: "GET", path: "/carts" },
    async ({ fields, session_id }: { fields: string, session_id?: string }): Promise<({ carts: CartEntity[] })> => {
        const authData = getAuthData()

        const query = Carts()
        if (authData) {
            query.where("user_id", "=", authData.userID)
        } else if (session_id) {
            query.where("session_id", "=", session_id)
        } else {
            throw APIError.unauthenticated("Unauthenticated")
        }

        if (fields) {
            query.column(fields.split(","))
        }

        const carts = await query.select<CartEntity[]>()

        return {
            carts: carts.map(cart => ({
                id: Number(cart.id),
                ...cart
            }))
        }
    }
)

export const addToCart = api(
    { method: "POST", path: "/carts" },
    async ({ cart, session_id }: { cart: AddToCartRequest, session_id?: string }): Promise<({ id: number })> => {
        const authData = getAuthData()

        let cartRequest: CartEntity = {
            session_id: 0,
            user_id: 0,

            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),

            ...cart
        }

        // on adding exactly same product (means also from same shop)
        // then just increment the qty
        const productExistQuery = Carts().
            where("product_id", "=", cartRequest.product_id).
            andWhere("shop_id", "=", cartRequest.shop_id)

        if (authData) {
            cartRequest.user_id = Number(authData.userID)
            productExistQuery.andWhere("user_id", "=", authData.userID)
        } else if (session_id) {
            cartRequest.session_id = Number(session_id)
            productExistQuery.andWhere("session_id", "=", session_id)
        } else {
            throw APIError.unauthenticated("Unauthenticated")
        }

        const productExist = await productExistQuery.first()
        if (productExist?.id) {
            await Carts().where("id", "=", productExist.id).update({
                qty: (productExist.qty ?? 0) + (cartRequest.qty ?? 0)
            })
            return { id: productExist.id }
        }

        let newCart = (await Carts().insert(cartRequest, "id"))[0]

        newCart.id = Number(newCart.id)
        return { id: newCart.id }
    }
)

export const updateCartQty = api(
    { method: "PUT", path: "/carts:id" },
    async ({ id, session_id, qty }: { id: number, session_id: string, qty: number }): Promise<({ id: number })> => {
        const authData = getAuthData()
        const productExistQuery = Carts().where("id", "=", id)

        if (authData) {
            productExistQuery.andWhere("user_id", "=", authData.userID)
        } else if (session_id) {
            productExistQuery.andWhere("session_id", "=", session_id)
        } else {
            throw APIError.unauthenticated("Unauthenticated")
        }
        const updateQuery = productExistQuery.clone()

        const cartProduct = await productExistQuery.clone().first()
        if (!cartProduct) {
            throw APIError.notFound("Cart id: " + id + " not found")
        }

        const updatedCart = (await updateQuery.update({
            qty: qty,
            updated_at: (new Date()).toISOString(),
        }, "id"))[0]

        return { id: Number(updatedCart.id) }
    }
)

export const deleteCart = api(
    { method: "DELETE", path: "/carts:id" },
    async ({ id, session_id }: { id: number, session_id: string }): Promise<({ id: number })> => {
        const authData = getAuthData()
        const productExistQuery = Carts().where("id", "=", id)

        if (authData) {
            productExistQuery.andWhere("user_id", "=", authData.userID)
        } else if (session_id) {
            productExistQuery.andWhere("session_id", "=", session_id)
        } else {
            throw APIError.unauthenticated("Unauthenticated")
        }
        const deleteQuery = productExistQuery.clone()

        const cartProduct = await productExistQuery.clone().first()
        if (!cartProduct) {
            throw APIError.notFound("Cart id: " + id + " not found")
        }

        await deleteQuery.del()
        return { id }
    }
)