import { api, APIError } from "encore.dev/api";
import { PaginationRequest, SaveProductRequest } from "../../graphql/__generated__/resolvers-types";
import { Products, ProductEntity } from "./db";
import { getAuthData } from "~encore/auth";

export interface GetProductParams extends PaginationRequest {
    q: string
    fields?: string
    shopId?: number
    productId?: number
    isOwner: boolean
}

export const getProducts = api(
    { method: "GET", path: "/products" },
    async (params: GetProductParams): Promise<({ products: ProductEntity[], total: number })> => {
        const query = Products()

        if (params.q) {
            query.andWhere(function () {
                const q = "%" + params.q + "%"
                this.whereILike("name", q).orWhereILike("description", q)
            })
        }

        if (params.productId) {
            query.andWhere("product_id", "=", params.productId)
        }

        if (params.shopId) {
            query.andWhere("shop_id", "=", params.shopId)
        }

        if (!params.isOwner) {
            query.andWhere("deleted_at", "is", null)
        }

        // count total
        const totalQuery = query.clone().count("id")

        // keyset pagination
        const paginationQuery = query.clone().orderBy("id", "asc")
            .where("id", ">=", params.cursor ?? 0)
            .limit(params.limit ?? 10)

        if (params.fields) {
            paginationQuery.column(params.fields.split(","))
        }

        const [totalResult, products] = await Promise.all([
            totalQuery,
            paginationQuery.select<ProductEntity[]>()
        ])

        return {
            products: products.map(product => ({
                ...product,
                shop_id: product.shop_id ?? 0,
                user_id: product.user_id ?? 0,
            })),
            total: Number(totalResult[0].count)
        }
    }
)

export const saveProduct = api(
    { method: "POST", path: "/product", auth: true },
    async ({ product, shopId }: { product: SaveProductRequest, shopId: number }): Promise<{ savedProduct: ProductEntity }> => {
        // TODO file save for product icon (later in product detail future issue)
        // validation
        if (!shopId) {
            throw APIError.permissionDenied("No shop")
        }

        const authData = getAuthData()
        if (!authData) { // TODO! on auth:true this is not needed
            throw APIError.unauthenticated("Unauthenticated")
        }
        
        // --end validation
            if (!product.id) {
                product.id = undefined
            }

        const productRequest: ProductEntity = {
            shop_id: shopId,
            user_id: Number(authData.userID),

            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),

            ...product
        }

        let savedProduct = (await Products().insert(productRequest, "*").onConflict("id").merge())[0]

        // dang with JS float to string ORM -.-
        savedProduct.price = parseFloat(String(savedProduct.price))
        return { savedProduct }
    }
)

/**
 * first delete is soft delete,
 * next delete will be totally removed
 */
export const deleteProduct = api(
    { method: "DELETE", path: "/product:id", auth: true },
    async ({ id }: { id?: number }): Promise<{ deletedId: number }> => {
        const authData = getAuthData()
        if (!authData) {
            throw APIError.unauthenticated("Unauthenticated")
        }

        if (!id) {
            throw APIError.invalidArgument("InvalidArgument")
        }

        const product = await Products()
            .where("id", "=", id)
            .andWhere("user_id", "=", authData.userID)
            .select("id", "deleted_at")
            .first()

        if (!product) {
            throw APIError.notFound("Product not found")
        }

        const deleteQuery = Products()
            .where("id", "=", id)
            .andWhere("user_id", "=", authData.userID)
            .returning("id")

        if (product.deleted_at) { // permanent deletion
            const deletedId = await deleteQuery.delete() as { id: number }[]
            return { deletedId: deletedId[0].id }
        } else { // soft delete
            const deletedId = await deleteQuery
                .update({
                    "deleted_at": (new Date()).toISOString(),
                }) as { id: number }[]
            return { deletedId: deletedId[0].id }
        }
    }
)

// validation
export const isProductOwner = api(
    { method: "GET", path: "/product:id" },
    async ({ id, userId }: { id: number, userId: number }): Promise<{ isOwner: boolean }> => {
        const product = await Products()
            .where("id", "=", id)
            .andWhere("user_id", "=", userId)
            .select<ProductEntity>("id")
            .first()
        if (product?.id) {
            return { isOwner: true }
        }
        return { isOwner: false }
    }
)

export const checkProductsExist = api(
    { method: "POST", path: "/product/check-exist" },
    async ({ productIds }: { productIds: number[] }): Promise<({ products: Record<number, boolean> })> => {
        let products: Record<number, boolean> = {}

        const productResults = await Products().whereIn("id", productIds).
            column("id").
            select<ProductEntity[]>()

        for (const product of productResults) {
            if (product.id) {
                products[Number(product.id)] = true
            }
        }
        return { products }
    }
)