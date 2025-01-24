import { api, APIError, ErrCode } from "encore.dev/api"
import {JWK, JWT, JWTPayload, JWKGenerateOptions} from "ts-jose"
import packageJson from '../package.json'
import { UserRegisterRequest } from "../graphql/__generated__/resolvers-types"
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts"

import { UserEntity, Users } from "../user/db"

const salt = genSaltSync(10);

const jwk = await generateKeyPair() // TODO! maybe use encore secret next time? yes fix this

export interface Claims {
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
        select("id", "username", "password_hash").
        first()

        if (!user) {
            throw new APIError(ErrCode.InvalidArgument, "username " + username + " not found")
        }

        if (!compareSync(password, user.password_hash??"")) {
            throw new APIError(ErrCode.InvalidArgument, "username or password is invalid")
        }

        const token = await generateToken(user)
        return { token }
    }
)

export const verify = api(
    { method: "POST", path: "/verify" },
    async ({token}: {token: string}): Promise<{claims: Claims}> => {
        const payload = await JWT.verify(token, jwk)
        const claims = payload.claims as Claims

        return {claims}
    }
)

async function generateKeyPair(): Promise<JWK> {
    const option: JWKGenerateOptions = { use: "sig", modulusLength: 2048}
    return await JWK.generate("RS256", option)
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