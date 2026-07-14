// Importing the version number from the package.json file
import { version } from '../package.json' with { type: "json" };

// Importing the main DiscordFivemApi class
import DiscordFivemApi, { DiscordFivemApiOptions } from './DiscordFivemApi';

// Importing the Player and Server classes from the structures directory
import { Player, ServerData } from './structures/index';

/**
 * Exports the version number, main API class, and structure classes.
 *
 * - `version`: The current version of the package.
 * - `DiscordFivemApi`: The primary API interface for interacting with FiveM servers.
 * - `Player`: Class representing player data in the server.
 * - `Server`: Class representing server data.
 */
export {
  version,
  DiscordFivemApi,
  DiscordFivemApiOptions,
  Player,
  ServerData,
};
