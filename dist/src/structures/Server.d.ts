export interface ServerInfo {
    enforceSteamAuth: boolean;
    enhancedHostSupport: boolean;
    icon: string;
    requestSteamTicket: string;
    resources: string[];
    server: string;
    vars: ServerVars;
    version: number;
}
export interface ServerVars {
    [key: string]: string;
}
/**
 * Class representing server data with encapsulated properties.
 */
declare class ServerData implements ServerInfo {
    readonly enforceSteamAuth: boolean;
    readonly enhancedHostSupport: boolean;
    readonly icon: string;
    readonly requestSteamTicket: string;
    readonly resources: string[];
    readonly server: string;
    readonly vars: ServerVars;
    readonly version: number;
    /**
     * Constructs a new ServerData instance.
     *
     * @param {ServerInfo} data - The raw server data object.
     */
    constructor(data: ServerInfo);
}
export default ServerData;
//# sourceMappingURL=Server.d.ts.map