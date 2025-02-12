import { api, APIError, ErrCode } from "encore.dev/api"
import packageJson from '../../package.json'
import { compare, genSalt, hash } from "bcrypt-ts"

import { UserDetailEntity, UserDetails, UserEntity, Users } from "../user/db"
import { UserRegisterRequest } from "../../graphql/__generated__/resolvers-types"
import { SignJWT, jwtVerify, generateKeyPair, exportPKCS8, importPKCS8, exportSPKI, importSPKI, KeyLike } from 'jose';
import { secret } from "encore.dev/config"

// TODO? maybe use ES256 (ECDSA) or EdDSA for smaller bandwidth with equivalent security of RS256, PS256 but also faster
const jwkPublicKey = secret("JWK_PUBLIC_KEY")
const jwkPrivateKey = secret("JWK_PRIVATE_KEY")

const salt = await genSalt(10);

const { publicKey, privateKey } = await getKey()

export interface Claims {
    user_id: number,
    user_name: string,
}

export const register = api(
    { method: "POST", path: "/register" },
    async ({ request }: { request: UserRegisterRequest }): Promise<{ token: string }> => {
        const hashPass = await hash(request.password, salt)
        const newUser: UserEntity = {
            username: request.username,
            email: request.email,
            password_hash: hashPass,
            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),
        }

        const user = (await Users().insert(newUser, "*"))[0]

        // insert detail
        const newUserDetail: UserDetailEntity = {
            user_id: user.id,
            fullname: request.fullname,
            address: request.address,
            province_id: request.province_id ?? undefined,
            city_id: request.city_id ?? undefined,
            district_id: request.district_id ?? undefined,

            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),
        }
        await UserDetails().insert(newUserDetail)

        const token = await generateToken(user)
        return { token }
    }
)

export const login = api(
    { method: "POST", path: "/login" },
    async ({ username, password }: { username: string, password: string }): Promise<{ token: string }> => {
        const user = await Users().
            where("username", username).
            select("id", "username", "password_hash").
            first()

        if (!user) {
            throw new APIError(ErrCode.InvalidArgument, "username " + username + " not found")
        }

        if (! await compare(password, user.password_hash ?? "")) {
            throw new APIError(ErrCode.InvalidArgument, "username or password is invalid")
        }

        const token = await generateToken(user)
        return { token }
    }
)

export const verify = api(
    { method: "POST", path: "/verify" },
    async ({ token }: { token: string }): Promise<{ claims: Claims }> => {
        const { payload } = await jwtVerify(token, publicKey, {
            issuer: packageJson.name,
            audience: packageJson.name,
        })
        const claims: Claims = {
            user_id: payload.user_id as number,
            user_name: payload.user_name as string,
        }

        return { claims }
    }
)

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

async function generateToken(user: UserEntity): Promise<string> {
    return await new SignJWT({
        'user_id': Number(user.id ?? 0),
        'user_name': user.username,
    }).
        setProtectedHeader({
            alg: "PS256"
        }).
        setIssuedAt().
        setIssuer(packageJson.name).
        setAudience(packageJson.name).
        setExpirationTime('4h').
        sign(privateKey)
}