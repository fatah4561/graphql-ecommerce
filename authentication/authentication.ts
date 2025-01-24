import { api, APIError, ErrCode } from "encore.dev/api"
import {JWK, JWT, JWTPayload, JWKGenerateOptions} from "ts-jose"
import packageJson from '../package.json'
import { User, UserRegisterRequest } from "../graphql/__generated__/resolvers-types"
import { SQLDatabase } from "encore.dev/storage/sqldb"
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts"
import knex from "knex"

const UserDB = new SQLDatabase("user", {
    migrations: "./migrations"
})

const orm = knex({
    client: "pg",
    connection: UserDB.connectionString,
})

type UserEntity = User&{password_hash: string};
const Users = () => orm<UserEntity>("users");

const salt = genSaltSync(10); // TODO? i think this will make old password invalid on re deploy -.-

const jwk = await generateKeyPair() // TODO? maybe use encore secret next time?

interface Claims {
    user_id: string,
    user_name: string,
}

export const register = api(
    { method: "POST", path: "/register"},
    async({request}: {request: UserRegisterRequest}): Promise<{token: string}> => {
        const hashPass = hashSync(request.password, salt)
        const newUser: UserEntity = {
            username: request.username,
            // fullname: request.fullname, // TODO add fullname to other table 
            email: request.email,
            password_hash: hashPass,
            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),
        }

        const user = (await Users().insert(newUser, "*"))[0]
        const token = await generateToken(user)
        return {token}
    }
)

export const login = api(
    { method: "POST", path: "/login"},
    async ({username, password}: {username: string, password: string}): Promise<{ token: string }> => {
        const user = await Users().
        where("username", username).
        select("id", "password_hash").
        first()

        if (!user) {
            throw new APIError(ErrCode.InvalidArgument, "username " + username + " not found")
        }

        if (!compareSync(password, user.password_hash)) {
            throw new APIError(ErrCode.InvalidArgument, "username or password is invalid")
        }

        const payload: JWTPayload = {
            sub: packageJson.name,
            iss: packageJson.name,
            iat: Date.now(),
            exp: Date.now() + 2 * 60 * 60 * 1000, // 2 hour
            claims: {
                user_id: user.id,
                user_name: username,
            }
        }

        const token = await JWT.sign(payload, jwk)
        return { token }
    }
)

export const verify = api(
    { method: "POST", path: "/verify" },
    async ({token}: {token: string}): Promise<{user?: string}> => {
        const payload = await JWT.verify(token, jwk)
        const claims = payload.claims as Claims

        return {user: claims.user_name}
    }
)

async function generateKeyPair(): Promise<JWK> {
    const option: JWKGenerateOptions = { use: "sig", modulusLength: 2048}
    const key = await JWK.generate("RS256", option)
    return key
}

async function generateToken(user: UserEntity): Promise<string> {
    const payload: JWTPayload = {
        sub: packageJson.name,
        iss: packageJson.name,
        iat: Date.now(),
        exp: Date.now() + 2 * 60 * 60 * 1000, // 2 hour
        claims: {
            user_id: user.id,
            user_name: user.username,
        }
    }

    return await JWT.sign(payload, jwk)
}