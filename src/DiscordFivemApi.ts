// Import required modules
import { EventEmitter } from 'events';
import { Player, ServerData } from './structures/index';
import { DfaError , DfaTypeError } from './util/Error';
import { ServerInfo } from './structures/Server';
import { Players, PlayerData } from './structures/Player';

export interface DiscordFivemApiOptions {
  address: string;
  port?: number;
  useStructure?: boolean;
  interval?: number;
  [key: string]: any;
}

// Define DiscordFivemApi class
class DiscordFivemApi extends EventEmitter {
  options: DiscordFivemApiOptions;
  useStructure: boolean;
  _players: (Player | PlayerData)[] = [];
  address: string;
  port: number;
  resources: string[];
  // Constructor
  constructor(options: DiscordFivemApiOptions, init: boolean = false) {
    super();

    // Set default options if not provided
    this.options = {
      port: 30120,
      useStructure: false,
      interval: 2500,
      ...options,
    };

    // Validate options
    if (!this.options.address) {
      throw new DfaError('NO_ADDRESS', 'No address was provided.');
    }
    if (!this.options.port) {
      throw new DfaError('NO_PORT', 'No port was provided.');
    }

    if (typeof this.options.address !== 'string') {
      throw new DfaTypeError(
        'INVALID_ADDRESS',
        'The address option must be a string.'
      );
    }

    if (typeof this.options.port !== 'number') {
      throw new DfaTypeError(
        'INVALID_PORT',
        'The port option must be a number.'
      );
    }

    if (typeof this.options.interval !== 'number') {
      throw new DfaTypeError(
        'INVALID_INTERVAL',
        'The interval option must be a number.'
      );
    }

    if (typeof init !== 'boolean') {
      throw new DfaTypeError(
        'INVALID_INIT',
        'The init option must be a boolean.'
      );
    }
    if (
      this.options.useStructure !== undefined &&
      typeof this.options.useStructure !== 'boolean'
    ) {
      throw new DfaTypeError(
        'INVALID_USE_STRUCTURE',
        'The useStructure option must be a boolean.'
      );
    }

    // Initialize properties
    this._players = [];
    this.useStructure = this.options.useStructure ?? false;

    this.address = this.options.address;
    this.port = this.options.port;

    // Call _init method if init is true
    if (init) this._init();
  }

  // Getters and setters
  get players() {
    return this._players;
  }

  set players(players) {
    this._players = players;
  }

  // Get server status
  async getStatus() {
    try {
      const res = await fetch(`http://${this.address}:${this.port}/info.json`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return 'online';
    } catch {
      return 'offline';
    }
  }

  // Get server data
  async getServerData() {
    try {
      const res = await fetch(`http://${this.address}:${this.port}/info.json`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: ServerInfo = await res.json() as ServerInfo;
      if (this.useStructure) {
        return new ServerData(data);
      }
      return data;
    } catch (err: any) {
      throw {
        error: {
          message: err.message,
          stack: err.stack,
        },
        data: {},
      };
    }
  }

  // Get server players
  async getServerPlayers() {
    try {
      const res = await fetch(`http://${this.address}:${this.port}/players.json`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: Players = await res.json() as Players;
      if (this.useStructure) {
        const players = [];
        for (const player of data) {
          players.push(new Player(player));
        }
        this.players = players;

        return players;
      }
      return data;
    } catch (err: any) {
      throw {
        error: {
          message: err.message,
          stack: err.stack,
        },
        players: [],
      };
    }
  }

  // Get number of players online
  async getPlayersOnline() {
    try {
      const res = await fetch(`http://${this.address}:${this.port}/players.json`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: Players = await res.json() as Players;
      return data.length;
    } catch (err: any) {
      throw {
        error: {
          message: err.message,
          stack: err.stack,
        },
        playersOnline: 0,
      };
    }
  }

  // Get maximum number of players
  async getMaxPlayers() {
    try {
      const res = await fetch(`http://${this.address}:${this.port}/info.json`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: ServerInfo = await res.json() as ServerInfo;
      return data.vars.sv_maxClients;
    } catch (err: any) {
      throw {
        error: {
          message: err.message,
          stack: err.stack,
        },
        maxPlayers: 0,
      };
    }
  }
  

  // Initialize the API
  async _init() {
    this.emit('ready');

    const [serverData, players] = await Promise.all([
      this.getServerData().catch(() => {}),
      this.getServerPlayers().catch(() => []),
    ]);

    this.players = players;
    this.resources = (serverData as ServerInfo)?.resources ?? [];

    this.emit('readyPlayers', players);
    this.emit('readyResources', this.resources);

    setInterval(async () => {
      const newPlayers = await this.getServerPlayers().catch(() => []) as (Player | PlayerData)[];
      if (this.players.length != newPlayers.length) {
        if (this.players.length < newPlayers.length) {
          for (const player of newPlayers) {
            if (this.players.find((p) => p?.id == player?.id)) continue;
            this.emit('playerJoin', player);
          }
        } else {
          for (const player of this.players) {
            if (newPlayers.find((p) => p?.id == player?.id)) continue;
            this.emit('playerLeave', player);
          }
        }

        this.players = newPlayers;
      }

      const serverData2 = await this.getServerData().catch(() => {});
      const newResources = (serverData2 as ServerInfo)?.resources ?? [];
      if (this.resources?.length != newResources?.length) {
        if (this.resources?.length < newResources?.length) {
          for (const resource of newResources) {
            if (this.resources.find((r) => r == resource)) continue;
            this.emit('resourceAdd', resource);
          }
        } else {
          for (const resource of this.resources) {
            if (newResources.find((r) => r == resource)) continue;
            this.emit('resourceRemove', resource);
          }
        }
      }
    }, this.options?.interval || 2500);
  }
}

export default DiscordFivemApi;

/**
 * The DiscordFivemApi class.
 * @typedef {DiscordFivemApi} DiscordFivemApi
 * @property {Object} options The options for the API.
 * @property {string} options.address The IP address of the FiveM server.
 * @property {number} options.port The port of the FiveM server.
 * @property {boolean} options.useStructure Whether to use the structures or not.
 * @property {number} [options.interval=2500] The interval to check for player and resource changes.
 */
