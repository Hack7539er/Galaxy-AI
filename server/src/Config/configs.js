export default class Configs {

    static getOriginURL = () => process.env.ORIGINS;
    static getServerRunningPort = () => process.env.SERVER_RUNNING_PORT;
}