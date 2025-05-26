import { api, APIError } from "encore.dev/api"
import { user as userClient } from "~encore/clients"
import { secret } from "encore.dev/config"

import packageJson from '../../package.json'
import { compare, genSalt, hash } from "bcrypt-ts"

import { UserDetailEntity, UserEntity } from "../user/db"
import { ShopEntity } from "../shop/db"
import { UserRegisterRequest } from "../../graphql/__generated__/resolvers-types"
import { SignJWT, jwtVerify, generateKeyPair, exportPKCS8, importPKCS8, exportSPKI, importSPKI, KeyLike } from 'jose';
import { appConfig } from "../../helpers/app_config"

// TODO? maybe use ES256 (ECDSA) or EdDSA for smaller bandwidth with equivalent security of RS256, PS256 but also faster
const jwkPublicKey = secret("JWK_PUBLIC_KEY")
const jwkPrivateKey = secret("JWK_PRIVATE_KEY")

const salt = await genSalt(10);

const { publicKey, privateKey } = await getKey()

export interface Claims {
    user_id: number,
    user_name: string,
    shop_id: number,
}

export const register = api(
    { method: "POST", path: "/register" },
    async ({ request }: { request: UserRegisterRequest }): Promise<{ token: string }> => {
        // check email registered
        const { registered } = await userClient.checkEmailRegistered({ email: request.email })
        if (registered) {
            throw APIError.invalidArgument("Email is registered")
        }

        // insert user
        const hashPass = await hash(request.password, salt)
        const newUser: UserEntity = {
            username: request.username,
            email: request.email,
            password_hash: hashPass,
        }
        const { userId } = await userClient.createUser({ request: newUser })
        newUser.id = userId

        // insert detail
        const newUserDetail: UserDetailEntity = {
            user_id: userId,
            fullname: request.fullname,
            address: request.address,
            province_id: request.province_id ?? undefined,
            city_id: request.city_id ?? undefined,
            district_id: request.district_id ?? undefined,
        }
        await userClient.createUserDetail({ request: newUserDetail })

        const token = await generateToken(newUser)
        return { token }
    }
)

export const login = api(
    { method: "POST", path: "/login" },
    async ({ username, password }: { username: string, password: string }): Promise<{ user: UserEntity }> => {
        const { user } = await userClient.getSingleUser({ username, fields: "id,username,password_hash" })

        if (!user) {
            throw APIError.invalidArgument("username " + username + " not found")
        }

        if (! await compare(password, user.password_hash ?? "")) {
            throw APIError.invalidArgument("username or password is invalid")
        }
        user.id = Number(user.id)

        // const token = await generateToken(user)
        return { user }
    }
)

export const verify = api(
    { method: "POST", path: "/verify" },
    async ({ token }: { token: string }): Promise<{ claims: Claims }> => {
        try {
            const { payload } = await jwtVerify(token, publicKey, {
                issuer: packageJson.name,
                audience: packageJson.name,
            })
            const claims: Claims = {
                user_id: payload.user_id as number,
                user_name: payload.user_name as string,
                shop_id: payload.shop_id as number,
            }

            return { claims }
        } catch (err) {
            throw APIError.unauthenticated(String(err))
        }
    }
)

// non API functions
async function getKey(): Promise<{ publicKey: KeyLike, privateKey: KeyLike }> {
    if (jwkPublicKey() && jwkPrivateKey()) {
        const ecPublicKey = await importSPKI(jwkPublicKey(), 'PS256')
        const ecPrivateKey = await importPKCS8(jwkPrivateKey(), 'PS256')

        return { publicKey: ecPublicKey, privateKey: ecPrivateKey }
    }

    const { publicKey, privateKey } = await generateKeyPair('PS256')
    console.warn("WARNING!! using newly generated key, encore secret is not set")

    const pkcs8Pem = await exportPKCS8(privateKey)
    console.log(pkcs8Pem)

    const spki = await exportSPKI(publicKey)
    console.log(spki)

    return { publicKey, privateKey }
}

export async function generateToken(user: UserEntity, shop?: ShopEntity): Promise<string> {
    if (!user.id) {
        throw APIError.unauthenticated("unauthenticated")
    }

    return await new SignJWT({
        'user_id': Number(user.id),
        'user_name': user.username,
        'shop_id': shop?.id ?? 0,
    }).
        setProtectedHeader({
            alg: "PS256"
        }).
        setIssuedAt().
        setIssuer(packageJson.name).
        setAudience(packageJson.name).
        setExpirationTime(appConfig().app.tokenExpiration ?? '4h').
        sign(privateKey)
}