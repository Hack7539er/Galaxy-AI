import "dotenv/config";
import Configs from "./src/Config/configs.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// === Server Running Port === //
const __SERVER__PORT__ = Configs.getServerRunningPort() || null;

// === Checking Server Port Is Avaliable Or Not If Not Avalible Then Exit With Status Code 404
if (__SERVER__PORT__ === null) {

    console.error("Server Error: Server PORT Is Not Found.")

    throw new Error("Server Error: Server PORT Is Not Found.");

    process.exit(404);

}

// === Server Instance === //
const server = express();

// === Server Middlewares === //
server.use(express.json());
server.use(cookieParser());
server.use(cors({ origin: Configs.getOriginURL().split(","), credentials: true }));

// === Server Routers/Routes/Route All Here === //
