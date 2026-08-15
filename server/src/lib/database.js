import Configs from "../config/configs.js";
import mongoose from "mongoose";

const connectToMongoDB = async () => {

    mongoose.connection.on("connected", () => {
        console.log("Mongo DB: Database Connected.");
    });

    try {
        await mongoose.connect(Configs.getMongoDBUrl());

    } catch (Error) {

        console.error(Error);
    } finally {

        process.exit(1);
    }
}