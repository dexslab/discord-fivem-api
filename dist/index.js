import { EventEmitter } from "events";
//#region package.json
var version = "2.0.6";
//#endregion
//#region src/structures/Player.ts
/**
* Represents a player with structured data and utility methods.
*/
var Player = class {
	endpoint;
	id;
	identifiers;
	name;
	ping;
	/**
	* Constructs a new Player instance.
	*
	* @param {PlayerData} data - The raw player data object.
	*/
	constructor(data) {
		this.endpoint = data.endpoint;
		this.id = data.id;
		this.name = data.name;
		this.ping = data.ping;
		const parsedIdentifiers = {};
		if (Array.isArray(data.identifiers)) {
			for (const identifier of data.identifiers) if (typeof identifier === "string" && identifier.includes(":")) {
				const [idType, idValue] = identifier.split(":");
				parsedIdentifiers[idType] = idValue;
			}
		}
		this.identifiers = parsedIdentifiers;
	}
	/**
	* Returns the player's name, or 'Unknown' if no name is available.
	*
	* @returns {string} - The player's name or 'Unknown'.
	*/
	toString() {
		return this.name ?? "Unknown";
	}
	/**
	* Returns a flattened JSON representation of the player object.
	*
	* @param {...any} props - Additional properties to include in the flattened output.
	* @returns {Object} - The flattened player data object.
	*/
	toJSON(...props) {
		return JSON.stringify(this, ...props);
	}
};
//#endregion
//#region src/structures/Server.ts
/**
* Class representing server data with encapsulated properties.
*/
var ServerData = class {
	enforceSteamAuth;
	enhancedHostSupport;
	icon;
	requestSteamTicket;
	resources;
	server;
	vars;
	version;
	/**
	* Constructs a new ServerData instance.
	*
	* @param {ServerInfo} data - The raw server data object.
	*/
	constructor(data) {
		this.enforceSteamAuth = data.enforceSteamAuth;
		this.enhancedHostSupport = data.enhancedHostSupport;
		this.icon = data.icon;
		this.requestSteamTicket = data.requestSteamTicket;
		this.resources = data.resources;
		this.server = data.server;
		this.vars = data.vars;
		this.version = data.version;
	}
};
//#endregion
//#region src/util/Error.ts
var kCode = Symbol("code");
/**
* Creates a custom error class that extends a base error class (Error or TypeError).
*
* @param {Error} [ErrorBase= Error] - The base error class to extend (default is the built-in Error).
* @returns {class} - A custom error class with enhanced functionality.
*/
function createErrorMessage(ErrorBase = Error) {
	class DiscordFivemApiError extends ErrorBase {
		/**
		* Constructs a new DiscordFivemApiError instance.
		*
		* @param {string} key - A custom error code or identifier.
		* @param {...any} args - Additional arguments passed to the base error class.
		*/
		constructor(key, ...args) {
			super(...args);
			this[kCode] = key;
			if (Error.captureStackTrace) Error.captureStackTrace(this, DiscordFivemApiError);
		}
		/**
		* Getter for the error name, including the custom error code.
		* @returns {string} - The formatted error name with the error code.
		*/
		get name() {
			return `[DiscordFivemApi] ${super.name} [${this[kCode]}]`;
		}
		/**
		* Getter for the error code.
		* @returns {string} - The error code assigned to the instance.
		*/
		get code() {
			return this[kCode];
		}
		/**
		* Overrides the default toString method to include the error code.
		* @returns {string} - The string representation of the error with the custom code.
		*/
		toString() {
			return `[DiscordFivemApi] ${super.toString()} [${this[kCode]}]`;
		}
	}
	return DiscordFivemApiError;
}
var DfaError = createErrorMessage(Error);
var DfaTypeError = createErrorMessage(TypeError);
//#endregion
//#region src/DiscordFivemApi.ts
var DiscordFivemApi = class extends EventEmitter {
	options;
	useStructure;
	_players = [];
	address;
	port;
	resources;
	constructor(options, init = false) {
		super();
		this.options = {
			port: 30120,
			useStructure: false,
			interval: 2500,
			...options
		};
		if (!this.options.address) throw new DfaError("NO_ADDRESS", "No address was provided.");
		if (!this.options.port) throw new DfaError("NO_PORT", "No port was provided.");
		if (typeof this.options.address !== "string") throw new DfaTypeError("INVALID_ADDRESS", "The address option must be a string.");
		if (typeof this.options.port !== "number") throw new DfaTypeError("INVALID_PORT", "The port option must be a number.");
		if (typeof this.options.interval !== "number") throw new DfaTypeError("INVALID_INTERVAL", "The interval option must be a number.");
		if (typeof init !== "boolean") throw new DfaTypeError("INVALID_INIT", "The init option must be a boolean.");
		if (this.options.useStructure !== void 0 && typeof this.options.useStructure !== "boolean") throw new DfaTypeError("INVALID_USE_STRUCTURE", "The useStructure option must be a boolean.");
		this._players = [];
		this.useStructure = this.options.useStructure ?? false;
		this.address = this.options.address;
		this.port = this.options.port;
		if (init) this._init();
	}
	get players() {
		return this._players;
	}
	set players(players) {
		this._players = players;
	}
	async getStatus() {
		try {
			const res = await fetch(`http://${this.address}:${this.port}/info.json`, { signal: AbortSignal.timeout(5e3) });
			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
			return "online";
		} catch {
			return "offline";
		}
	}
	async getServerData() {
		try {
			const res = await fetch(`http://${this.address}:${this.port}/info.json`, { signal: AbortSignal.timeout(5e3) });
			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
			const data = await res.json();
			if (this.useStructure) return new ServerData(data);
			return data;
		} catch (err) {
			throw {
				error: {
					message: err.message,
					stack: err.stack
				},
				data: {}
			};
		}
	}
	async getServerPlayers() {
		try {
			const res = await fetch(`http://${this.address}:${this.port}/players.json`, { signal: AbortSignal.timeout(5e3) });
			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
			const data = await res.json();
			if (this.useStructure) {
				const players = [];
				for (const player of data) players.push(new Player(player));
				this.players = players;
				return players;
			}
			return data;
		} catch (err) {
			throw {
				error: {
					message: err.message,
					stack: err.stack
				},
				players: []
			};
		}
	}
	async getPlayersOnline() {
		try {
			const res = await fetch(`http://${this.address}:${this.port}/players.json`, { signal: AbortSignal.timeout(5e3) });
			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
			return (await res.json()).length;
		} catch (err) {
			throw {
				error: {
					message: err.message,
					stack: err.stack
				},
				playersOnline: 0
			};
		}
	}
	async getMaxPlayers() {
		try {
			const res = await fetch(`http://${this.address}:${this.port}/info.json`, { signal: AbortSignal.timeout(5e3) });
			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
			return (await res.json()).vars.sv_maxClients;
		} catch (err) {
			throw {
				error: {
					message: err.message,
					stack: err.stack
				},
				maxPlayers: 0
			};
		}
	}
	async _init() {
		this.emit("ready");
		const [serverData, players] = await Promise.all([this.getServerData().catch(() => {}), this.getServerPlayers().catch(() => [])]);
		this.players = players;
		this.resources = serverData?.resources ?? [];
		this.emit("readyPlayers", players);
		this.emit("readyResources", this.resources);
		setInterval(async () => {
			const newPlayers = await this.getServerPlayers().catch(() => []);
			if (this.players.length != newPlayers.length) {
				if (this.players.length < newPlayers.length) for (const player of newPlayers) {
					if (this.players.find((p) => p?.id == player?.id)) continue;
					this.emit("playerJoin", player);
				}
				else for (const player of this.players) {
					if (newPlayers.find((p) => p?.id == player?.id)) continue;
					this.emit("playerLeave", player);
				}
				this.players = newPlayers;
			}
			const newResources = (await this.getServerData().catch(() => {}))?.resources ?? [];
			if (this.resources?.length != newResources?.length) if (this.resources?.length < newResources?.length) for (const resource of newResources) {
				if (this.resources.find((r) => r == resource)) continue;
				this.emit("resourceAdd", resource);
			}
			else for (const resource of this.resources) {
				if (newResources.find((r) => r == resource)) continue;
				this.emit("resourceRemove", resource);
			}
		}, this.options?.interval || 2500);
	}
};
/**
* The DiscordFivemApi class.
* @typedef {DiscordFivemApi} DiscordFivemApi
* @property {Object} options The options for the API.
* @property {string} options.address The IP address of the FiveM server.
* @property {number} options.port The port of the FiveM server.
* @property {boolean} options.useStructure Whether to use the structures or not.
* @property {number} [options.interval=2500] The interval to check for player and resource changes.
*/
//#endregion
export { DiscordFivemApi, Player, ServerData, version };

//# sourceMappingURL=index.js.map