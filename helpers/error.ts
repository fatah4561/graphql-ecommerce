import { APIError, ErrCode } from "encore.dev/api";
import { ErrorResponse } from "../graphql/__generated__/resolvers-types";

/**
 * Parse error object into ErrorResponse object.
 * If error is not an instance of APIError, it will use ErrCode.Internal as code and String(err) as message
 * @param err - error object
 * @returns ErrorResponse object
 */
export const parseError = (err: any): ErrorResponse => {
    const error = err as APIError
    return {
        code: error.code ?? ErrCode.Internal,
        message: error.message ?? String(err)
    }
}