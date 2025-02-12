import { api, APIError, ErrCode } from "encore.dev/api"
import { UserEntity, Users } from "./db"

export const getSingleUser = api(
    { method: "POST", path: "/user:username" }, // TODO refactor change to get so it is REST API compliant
    async ({ username, fields }: { username: string, fields?: Array<string> }): Promise<{ user: UserEntity }> => {
        const query = Users().
            where("username", username)

        if (fields) {
            query.column(fields)
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