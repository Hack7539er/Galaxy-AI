import { Router } from "express";
import { registerUser, loginUser, logOutUser, fetchUser } from "../controllers/Authentication.Controller.js";
import { authenticationMiddleware } from "../middleware/Authentication.Middleware.js";

/**
 * @name authenticationRouter
 * @description Express router for handling all authentication-related API endpoints
 * Includes routes for user registration, login, logout, and profile retrieval
 */
const authenticationRouter = Router();

/**
 * @name POST /api/auth/register
 * @description Register a new user with name, email, and password
 * @route POST /api/auth/register
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Object} User object (without password) and sets auth cookie
 * @example
 * // Request:
 * POST /api/auth/register
 * Content-Type: application/json
 * 
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 * 
 * // Response: 201 Created
 * {
 *   "user": {
 *     "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
 *     "name": "John Doe",
 *     "email": "john@example.com"
 *   }
 * }
 */
authenticationRouter.post("/register", registerUser);

/**
 * @name POST /api/auth/login
 * @description Authenticate user with email and password
 * @route POST /api/auth/login
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Object} User object (without password) and sets auth cookie
 * @example
 * // Request:
 * POST /api/auth/login
 * Content-Type: application/json
 * 
 * {
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 * 
 * // Response: 200 OK
 * {
 *   "user": {
 *     "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
 *     "name": "John Doe",
 *     "email": "john@example.com"
 *   }
 * }
 */
authenticationRouter.post("/login", loginUser);

/**
 * @name POST /api/auth/logout
 * @description Logout user by clearing authentication cookie
 * @route POST /api/auth/logout
 * @returns {Object} Success status message
 * @example
 * // Request:
 * POST /api/auth/logout
 * Cookie: token=<jwt-token>
 * 
 * // Response: 200 OK
 * {
 *   "success": true
 * }
 */
authenticationRouter.post("/logout", logOutUser);

/**
 * @name GET /api/auth/fetchUser
 * @description Fetch authenticated user's profile data
 * @route GET /api/auth/fetchUser
 * @requires Authentication middleware - JWT token in cookies
 * @returns {Object} User object (without password) including timestamps
 * @example
 * // Request:
 * GET /api/auth/fetchUser
 * Cookie: token=<jwt-token>
 * 
 * // Response: 200 OK
 * {
 *   "user": {
 *     "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "createdAt": "2024-08-15T19:00:00.000Z",
 *     "updatedAt": "2024-08-15T19:00:00.000Z"
 *   }
 * }
 */
authenticationRouter.get("/fetchUser", authenticationMiddleware, fetchUser);

export default authenticationRouter;