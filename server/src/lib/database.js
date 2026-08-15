import Configs from "../config/configs.js";
import mongoose from "mongoose";

/**
 * @name connectToMongoDB
 * @description Establishes connection to MongoDB database using mongoose
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Throws error if connection fails
 * @example
 * // Automatically called from server.js
 * connectToMongoDB();
 * // Logs: "Mongo DB: Database Connected."
 */
const connectToMongoDB = async () => {

    mongoose.connection.on("connected", () => {
        console.log("Mongo DB: Database Connected.");
    });

    try {
        await mongoose.connect(Configs.getMongoDBUrl());

    } catch (Error) {

        console.error(Error);
      
        process.exit(1);
    } 
}

export default connectToMongoDB;