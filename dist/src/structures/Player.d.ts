export type Players = PlayerData[];
export interface PlayerData {
    endpoint: string;
    id: number;
    identifiers: string[];
    name: string;
    ping: number;
}
/**
 * Represents a player with structured data and utility methods.
 */
declare class Player implements Omit<PlayerData, 'identifiers'> {
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
    constructor(data: PlayerData);
    /**
     * Returns the player's name, or 'Unknown' if no name is available.
     *
     * @returns {string} - The player's name or 'Unknown'.
     */
    toString(): string;
    /**
     * Returns a flattened JSON representation of the player object.
     *
     * @param {...any} props - Additional properties to include in the flattened output.
     * @returns {Object} - The flattened player data object.
     */
    toJSON(...props: any[]): string;
}
export default Player;
//# sourceMappingURL=Player.d.ts.map