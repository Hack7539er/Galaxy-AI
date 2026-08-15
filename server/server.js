/**
 * @name Galaxy AI Server
 * @description Main Express server application with MongoDB integration, authentication routes, and CORS support
 * @version 1.0.0
 * @author Galaxy AI Team
 * @requires express
 * @requires cors
 * @requires cookie-parser
 * @requires dotenv
 */

import "dotenv/config";
import Configs from "./src/config/configs.js";
import connectToMongoDB from "./src/lib/database.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authenticationRouter from "./src/routes/Authentication.Routes.js";

/**
 * @name __SERVER__PORT__
 * @description Server port number from environment configuration
 * @type {number}
 * @throws {Error} Exits with status code 404 if PORT is not configured
 */
const __SERVER__PORT__ = Configs.getServerRunningPort() || null;

/**
 * Port validation - ensures server port is configured before startup
 * Exits process with status 404 if port is missing/invalid
 */
if (
    __SERVER__PORT__ === null ||
    __SERVER__PORT__ === undefined ||
    __SERVER__PORT__ === ""
) {
    console.error("Server Error: Server PORT Is Not Found.");

    process.exit(404);
} 

/**
 * @name server
 * @description Express application instance
 * @type {Object}
 */
const server = express();

/**
 * Middleware configuration for the Express server
 * - express.json(): Parse JSON request bodies
 * - cookieParser(): Parse cookies from requests
 * - cors(): Enable Cross-Origin Resource Sharing with specified origins
 */
server.use(express.json());
server.use(cookieParser());
server.use(
    cors({ origin: Configs.getOriginURL().split(","), credentials: true }),
);

/**
 * API Routes
 * - /api/auth: Authentication endpoints (register, login, logout, fetchUser)
 */
server.use("/api/auth", authenticationRouter);

/**
 * Server startup
 * Starts the Express server on the configured port and initializes MongoDB connection
 */
server.listen(__SERVER__PORT__, () => {
    
    console.log("Server: Server Is Running");

    connectToMongoDB();
});

