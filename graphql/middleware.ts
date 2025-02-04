import { authentication } from "~encore/clients";
import { APIError, ErrCode } from "encore.dev/api";
import { Context } from "./graphql";
import { Claims } from "../authentication/authentication";

export async function verifyToken(context: Context): Promise<Claims> {
    try {
        const userClaims = (await authentication.verify({ token: context.token ?? "" })).claims;
        if (!userClaims) throw new APIError(ErrCode.Unauthenticated, "unauthenticated");
        return userClaims;
    } catch {
        throw new APIError(ErrCode.Unauthenticated, "unauthenticated");
    }
}
