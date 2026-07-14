import { EventEmitter } from 'events';
import { Player, ServerData } from './structures/index';
import { PlayerData } from './structures/Player';
export interface DiscordFivemApiOptions {
    address: string;
    port?: number;
    useStructure?: boolean;
    interval?: number;
    [key: string]: any;
}
export declare class DiscordFivemApi extends EventEmitter {
    options: DiscordFivemApiOptions;
    useStructure: boolean;
    _players: (Player | PlayerData)[];
    address: string;
    port: number;
    resources: string[];
    constructor(options: DiscordFivemApiOptions, init?: boolean);
    get players(): (PlayerData | Player)[];
    set players(players: (PlayerData | Player)[]);
    getStatus(): Promise<"online" | "offline">;
    getServerData(): Promise<ServerData>;
    getServerPlayers(): Promise<any[]>;
    getPlayersOnline(): Promise<number>;
    getMaxPlayers(): Promise<string>;
    _init(): Promise<void>;
}
/**
 * The DiscordFivemApi class.
 * @typedef {DiscordFivemApi} DiscordFivemApi
 * @property {Object} options The options for the API.
 * @property {string} options.address The IP address of the FiveM server.
 * @property {number} options.port The port of the FiveM server.
 * @property {boolean} options.useStructure Whether to use the structures or not.
 * @property {number} [options.interval=2500] The interval to check for player and resource changes.
 */
//# sourceMappingURL=DiscordFivemApi.d.ts.map