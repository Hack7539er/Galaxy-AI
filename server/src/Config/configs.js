/**
 * @class Configs
 * @description Configuration class that manages all environment variables and configuration settings for the application
 * @name Configs
 */
export default class Configs {

    /**
     * @name getOriginURL
     * @description Get the allowed CORS origins from environment variables
     * @returns {string} Comma-separated list of allowed origins
     * @example
     * const origins = Configs.getOriginURL();
     * // Returns: "http://localhost:3000,http://localhost:5173"
     */
    static getOriginURL = () => process.env.ORIGINS;

    /**
     * @name getServerRunningPort
     * @description Get the port number on which the server should run
     * @returns {number} Server port number
     * @example
     * const port = Configs.getServerRunningPort();
     * // Returns: 5000
     */
    static getServerRunningPort = () => process.env.SERVER_RUNNING_PORT;

    /**
     * @name getMongoDBUrl
     * @description Get the MongoDB connection URL from environment variables
     * @returns {string} MongoDB connection string
     * @example
     * const dbUrl = Configs.getMongoDBUrl();
     * // Returns: "mongodb+srv://user:password@cluster.mongodb.net/galaxy-ai"
     */
    static getMongoDBUrl = () => process.env.MONGO_DB_URL;

    /**
     * @name getJWTSecretKey
     * @description Get the JWT secret key for token generation and verification
     * @returns {string} JWT secret key
     * @example
     * const secretKey = Configs.getJWTSecretKey();
     * // Returns: "your-secret-jwt-key-here"
     */
    static getJWTSecretKey = () => process.env.JWT_SECRET_TOKEN_GENERATE_KEY;
}