import { api, APIError, ErrCode } from "encore.dev/api"
import { UserEntity, Users } from "./db"

export const getSingleUser = api(
    { method: "GET", path: "/user:username" },
    async ({ username, fields }: { username: string, fields?: string }): Promise<{ user: UserEntity }> => {
        const query = Users().
            where("username", username)

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
            throw new APIError(ErrCode.NotFound, "User not found")
        } else {
            // potgresql knex return bigint as string so this it to number
            user.id = Number(user.id) 
        }

        return { user: user ?? null }
    }
)