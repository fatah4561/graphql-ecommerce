import { Header, Gateway, APIError, ErrCode } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { authentication } from "~encore/clients";

// AuthParams specifies the incoming request information
// the auth handler is interested in. In this case it only
// cares about requests that contain the `Authorization` header.
interface AuthParams {
    authorization: Header<"Authorization">;
}

// The AuthData specifies the information about the authenticated user
// that the auth handler makes available.
interface AuthData {
    userID: string;
}

// The auth handler itself.
export const auth = authHandler<AuthParams, AuthData>(
    async (params) => {
        try {            
            const userClaims = await authentication.verify({token: params.authorization})
            return {userID: userClaims.claims.user_id.toString()};
        } catch (err) {
            throw err as APIError;
        }
    }
)

// Define the API Gateway that will execute the auth handler:
export const gateway = new Gateway({
    authHandler: auth,
})
