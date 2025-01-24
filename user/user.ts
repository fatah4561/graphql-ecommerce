import { api, APIError, ErrCode } from "encore.dev/api"
import { UserEntity, Users } from "./db"

export const getSingleUser = api(
    { method: "GET", path: "/user:username" },
    async ({username}: {username: string}): Promise<{user: UserEntity}> => {
        const user = await Users().
        where("username", username).
        select("id", "username", "email", "created_at", "updated_at").
        first()

        if (!user) {
            throw new APIError(ErrCode.NotFound, "User not found")
        }

        return {user: user?? null}
    }
)