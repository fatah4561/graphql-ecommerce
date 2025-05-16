import { api, APIError } from "encore.dev/api"
import { UserDetailEntity, UserDetails, UserEntity, Users } from "./db"
import { getAuthData } from "~encore/auth"

export const getSingleUser = api(
    { method: "GET", path: "/users:username" },
    async ({ username, fields }: { username?: string, fields?: string }): Promise<{ user: UserEntity }> => {
        const authData = getAuthData()
        if (!username && !authData) {
            throw APIError.invalidArgument("argument not specified")
        }

        const query = Users()

        if (username) {
            query.where("username", username)
        } else if (authData) {
            query.where("id", authData.userID)
        }

        if (fields) {
            query.column(fields.split(","))
        }

        const user = await query.
            select<UserEntity>().
            first()
        if (user) {
            user.id = Number(user.id);
        }

        if (!user) {
            throw APIError.notFound("User not found")
        } else {
            // potgresql knex return bigint as string so this it to number
            user.id = Number(user.id)
        }

        return { user: user ?? null }
    }
)

export const createUser = api(
    { method: "POST", path: "/users" },
    async ({ request }: { request: UserEntity }): Promise<{ userId: number }> => {
        const newUser: UserEntity = {
            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),

            ...request
        }

        const user = (await Users().insert(newUser, "*"))[0]

        return { userId: Number(user.id) }
    }
)

export const createUserDetail = api(
    { method: "POST", path: "/users/id:id" },
    async ({ request }: { request: UserDetailEntity }): Promise<{ userDetailId: number }> => {
        const newUserDetail: UserDetailEntity = {
            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),

            ...request
        }

        const userDetail = (await UserDetails().insert(newUserDetail, "*"))[0]
        return { userDetailId: Number(userDetail.id) }
    }
)

export const checkEmailRegistered = api(
    { method: "POST", path: "/users/email-check" },
    async ({ email }: { email: string }): Promise<{ registered: boolean }> => {
        const existedUser = await Users().where("email", "=", email)
            .select<UserEntity>("email").
            first()

        if (existedUser?.email) {
            return { registered: true }
        }
        return { registered: false }
    }
)