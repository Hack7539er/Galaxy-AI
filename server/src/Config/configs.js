export default class Configs {

    static getOriginURL = () => process.env.ORIGINS;
    static getServerRunningPort = () => process.env.SERVER_RUNNING_PORT;
    static getMongoDBUrl = () => process.env.MONGO_DB_URL;
}