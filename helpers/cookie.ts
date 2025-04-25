import { IncomingMessage, ServerResponse } from "http";
import crypto from "crypto";

/**
 * Extracts the session ID from the cookies of an incoming HTTP request.
 *
 * This function parses the "cookie" header of the provided HTTP request
 * to find and return the value associated with the "session_id" cookie.
 * If the "cookie" header is not present or the "session_id" cookie is 
 * not found, the function returns null.
 *
 * @param req - The incoming HTTP request object.
 * @returns The session ID as a string if found, otherwise null.
 */
export const getSessionIdFromCookies = (req: IncomingMessage) => {
    const cookies = req.headers["cookie"];
    if (!cookies) return null;

    const match = cookies.match(/session_id=([^;]+)/);
    return match ? match[1] : null;
};


/**
 * Sets a session cookie on the given HTTP response object.
 *
 * This function sets the "Set-Cookie" header of the provided HTTP response
 * object to a new random session ID. The cookie is set to be HttpOnly, 
 * Path=/, Max-Age=86400, and SameSite=Strict.
 *
 * @param res - The HTTP response object.
 * @returns The newly generated session ID as a string.
 */
export const setSessionCookie = (res: ServerResponse<IncomingMessage>): string => {
    const sessionId = crypto.randomBytes(16).toString("hex");
    res.setHeader("Set-Cookie", `session_id=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);
    return sessionId;
};
