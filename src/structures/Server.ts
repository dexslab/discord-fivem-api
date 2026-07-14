'use strict'; // Enforcing strict mode for better error handling and security


export interface ServerInfo {
  enforceSteamAuth: boolean
  enhancedHostSupport: boolean
  icon: string
  requestSteamTicket: string
  resources: string[]
  server: string
  vars: ServerVars
  version: number
}

export interface ServerVars {
  [key: string]: string
}



/**
 * Class representing server data with encapsulated properties.
 */
class ServerData implements ServerInfo {
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
  constructor(data: ServerInfo) {
    this.enforceSteamAuth = data.enforceSteamAuth;
    this.enhancedHostSupport = data.enhancedHostSupport;
    this.icon = data.icon;
    this.requestSteamTicket = data.requestSteamTicket;
    this.resources = data.resources;
    this.server = data.server;
    this.vars = data.vars;
    this.version = data.version;
  }
}

// Export the ServerData class to make it available for external modules
export default ServerData;
