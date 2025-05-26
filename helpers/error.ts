import { APIError, ErrCode } from "encore.dev/api";
import { ErrorResponse } from "../graphql/__generated__/resolvers-types";
import log from "encore.dev/log";

/**
 * Parse error object into ErrorResponse object.
 * If error is not an instance of APIError, it will use ErrCode.Internal as code and String(err) as message
 * @param err - error object
 * @returns ErrorResponse object
 */
export const parseError = (err: any): ErrorResponse => {
    const error = err as APIError
    // log.debug("ouch", error)
    return {
        code: error.code ?? ErrCode.Internal,
        message: error.message ?? String(err)
    }
}

/**
 * Return an ErrorResponse object with empty code and message.
 * Used for when we want to return a success response but without any data.
 */
export const emptyError = (): ErrorResponse => {
    return {
        code: "",
        message: "",
    }
}

/**
 * Due to encore backed by rust sometimes rust error is silenced and not returned
 * Hence still giving success response from the endpoint response
 * 
 * Here I attempt to log it if it's rust error and return it as internal APIError
 * e.g. "An internal error occurred.: InvalidArg, Failed to convert js number to serde_json::Number"
 * 
 *  If it's safe error (APIError type) then return it
 * @param err any
 * @returns APIError
 */
export const handleRustOrAPIError = (err: any): APIError => {
    if (err instanceof APIError) {
        return err
    }
    
    log.error("Internal error occurred, ", err)
    return APIError.internal("Internal error occurred")
}