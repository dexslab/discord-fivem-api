'use strict'; // Enforcing strict mode for better error handling and security



export type Players = PlayerData[]

export interface PlayerData {
  endpoint: string
  id: number
  identifiers: string[]
  name: string
  ping: number
}


/**
 * Represents a player with structured data and utility methods.
 */
class Player implements Omit<PlayerData, 'identifiers'> {
  readonly endpoint: string;
  readonly id: number;
  readonly identifiers: Record<string, string>;
  readonly name: string;
  readonly ping: number;

  /**
   * Constructs a new Player instance.
   *
   * @param {PlayerData} data - The raw player data object.
   */
  constructor(data: PlayerData) {
    this.endpoint = data.endpoint;
    this.id = data.id;
    this.name = data.name;
    this.ping = data.ping;

    // Parse identifiers array of "type:value" strings into a key-value record
    const parsedIdentifiers: Record<string, string> = {};
    if (Array.isArray(data.identifiers)) {
      for (const identifier of data.identifiers) {
        if (typeof identifier === 'string' && identifier.includes(':')) {
          const [idType, idValue] = identifier.split(':');
          parsedIdentifiers[idType] = idValue;
        }
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
    return this.name ?? 'Unknown';
  }

  /**
   * Returns a flattened JSON representation of the player object.
   *
   * @param {...any} props - Additional properties to include in the flattened output.
   * @returns {Object} - The flattened player data object.
   */
  toJSON(...props: any[]) {
    return JSON.stringify(this, ...props);
  }
}

// Export the Player class to make it available for external modules
export default Player;
