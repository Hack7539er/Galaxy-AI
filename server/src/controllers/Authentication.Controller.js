import Configs from "../config/configs.js";
import userModel from "../models/User.Model.js";
import { sign } from "jsonwebtoken";

/**
 * @name setSessionCookie
 * @description Helper function to generate JWT token and set it in HTTP-only cookie
 * @param {Object} response - Express response object
 * @param {Object} payload - Data to encode in JWT token
 * @param {String} payload.userId - User ID to include in token
 * @param {String} payload.email - User email to include in token
 * @returns {void}
 * @example
 * setSessionCookie(response, { userId: "123abc", email: "user@example.com" });
 */
const setSessionCookie = (response, payload) => {

    const userToken = sign(payload, Configs.getJWTSecretKey(), { expiresIn: "7d" });

    response.cookie("token", userToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    });
}

/**
 * @name registerUser
 * @description Controller function to register new user with validation
 * Creates new user document in database and sets authentication cookie
 * @async
 * @param {Object} request - Express request object
 * @param {Object} request.body - Request body
 * @param {String} request.body.name - User's full name (required)
 * @param {String} request.body.email - User's email address (required)
 * @param {String} request.body.password - User's password (required)
 * @param {Object} response - Express response object
 * @returns {Object} JSON response with user data or error message
 * @example
 * // Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 * 
 * // Success Response (201):
 * {
 *   "user": {
 *     "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
 *     "name": "John Doe",
 *     "email": "john@example.com"
 *   }
 * }
 * 
 * // Error Response (400/409):
 * {
 *   "Error": "User Already Exits With This \"john@example.com\" Email Address. Try Again With Different Email Address."
 * }
 */
export const registerUser = async (request, response) => {

    const { name, email, password } = request.body;

    if (!name || !email || !password) return response.status(400).json({
        Error: "Name, Email, Password Are Required For Register."
    });

    const trimmedEmail = email.toLowerCase().trim();

    const userAlreadyExisting = await userModel.findOne({ email: trimmedEmail });

    if (userAlreadyExisting) return response.status(409).json({
        Error: `User Already Exists With This \"${email}\" Email Address. Try Again With Different Email Address.`
    });

    const newCreatedUser = await userModel.create({
        name,
        email: trimmedEmail,
        password
    });

    setSessionCookie(response, { userId: newCreatedUser._id.toString(), email: newCreatedUser.email });

    return response.status(201).json({
        user: {
            _id: newCreatedUser._id,
            name: newCreatedUser.name,
            email: newCreatedUser.email
        }
    });
}

/**
 * @name loginUser
 * @description Controller function to authenticate existing user
 * Validates email and password against database and sets authentication cookie
 * @async
 * @param {Object} request - Express request object
 * @param {Object} request.body - Request body
 * @param {String} request.body.email - User's email address (required)
 * @param {String} request.body.password - User's password (required)
 * @param {Object} response - Express response object
 * @returns {Object} JSON response with user data or error message
 * @example
 * // Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 * 
 * // Success Response (200):
 * {
 *   "user": {
 *     "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
 *     "name": "John Doe",
 *     "email": "john@example.com"
 *   }
 * }
 * 
 * // Error Response (400/401):
 * {
 *   "Error": "The Password, Email Are Invalid Please Check Your Email, Password."
 * }
 */
export const loginUser = async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) return response.status(400).json({
        Error: "Email, Password Are Required For Login."
    });

    const userAlreadyExisting = await userModel.findOne({ email: email.toLowerCase().trim() });

    if (!userAlreadyExisting) return response.status(401).json({
        Error: "The Password, Email Are Invalid Please Check Your Email, Password."
    });

    const passwordIsValid = await userAlreadyExisting.comparePassword(password);

    if (!passwordIsValid) return response.status(401).json({
        Error: "Invalid Password Please Check Your Password."
    });

    setSessionCookie(response, { userId: userAlreadyExisting._id.toString(), email: userAlreadyExisting.email });

    return response.status(200).json({
        user: {
            _id: userAlreadyExisting._id,
            name: userAlreadyExisting.name,
            email: userAlreadyExisting.email
        }
    });
}

/**
 * @name logOutUser
 * @description Controller function to logout user by clearing authentication cookie
 * @param {Object} request - Express request object (not used)
 * @param {Object} response - Express response object
 * @returns {Object} JSON response with success status
 * @example
 * // Success Response (200):
 * {
 *   "success": true
 * }
 */
export const logOutUser = (_, response) => {
    
    response.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/"
    });

    return response.status(200).json({
        success: true
    });
}

/**
 * @name fetchUser
 * @description Controller function to fetch authenticated user's data from database
 * Requires valid JWT token in request cookies
 * @async
 * @param {Object} request - Express request object
 * @param {Object} request.user - Decoded JWT token data (set by authenticationMiddleware)
 * @param {String} request.user.userId - User ID from token
 * @param {Object} response - Express response object
 * @returns {Object} JSON response with user data (excluding password) or error message
 * @example
 * // Success Response (200):
 * {
 *   "user": {
 *     "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "createdAt": "2024-08-15T19:00:00.000Z",
 *     "updatedAt": "2024-08-15T19:00:00.000Z"
 *   }
 * }
 * 
 * // Error Response (401/404):
 * {
 *   "Error": "You Are Not Authenticated. Go To Login Or Register."
 * }
 */
export const fetchUser = async (request, response) => {

    if (!request.user) return response.status(401).json({
        Error: "You Are Not Authenticated. Go To Login Or Register."
    });

    const findUser = await userModel.findById(request.user.userId).select("-password");

    if (!findUser) return response.status(404).json({
        Error: "User Not Found."
    });

    return response.json({ user: findUser });
}