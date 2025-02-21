import { APIError, ErrCode } from "encore.dev/api";
import { ErrorResponse } from "../graphql/__generated__/resolvers-types";

export const parseError = (err: any): ErrorResponse => {
    const error = err as APIError
    return {
        code: error.code ?? ErrCode.Internal,
        message: error.message ?? String(err)
    }
}