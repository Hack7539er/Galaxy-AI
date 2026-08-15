import { verify } from "jsonwebtoken";
import Configs from "../config/configs.js";

/**
 * @name authenticationMiddleware
 * @description Middleware function to verify JWT token from cookies and authenticate user requests
 * Extracts token from cookies, verifies it, and attaches decoded user data to request object
 * @param {Object} request - Express request object
 * @param {Object} request.cookies - Cookie parser object containing auth token
 * @param {Object} response - Express response object
 * @param {Function} nextMiddleWareOrController - Callback function to proceed to next middleware/controller
 * @returns {Object} JSON response with error message if authentication fails, otherwise calls next middleware/controller
 * @throws {Error} Returns 401 status if token is invalid or expired
 * @example
 * // Usage in routes:
 * authenticationRouter.get("/fetchUser", authenticationMiddleware, fetchUser);
 * 
 * // If successful, request.user will contain:
 * // { userId: "64f8a1b2c3d4e5f6g7h8i9j0", email: "user@example.com" }
 */
export const authenticationMiddleware = (request, response, nextMiddleWareOrController) => {

    const userToken = request.cookies.token;

    if (!userToken) return response.status(401).json({
        Error: "You Are Not Authenticated. Token Not Found Go To Login/Register First."
    });

    try {

        const decodedToken = verify(userToken, Configs.getJWTSecretKey());

        request.user = decodedToken;

        nextMiddleWareOrController();
    } catch (Error) {

        return response.status(401).json({
            Error: "Invalid Token. Go To Sign In First"
        });
    }
}