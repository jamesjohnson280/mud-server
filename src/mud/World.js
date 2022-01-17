/**
 * The World manager
 * @module World
 */

/** The game world */
class World {
  #players;

  /**
   * Creates a new instance of the World
   * @example
   * const world = new World();
   */
  constructor() {
    this.#players = new Map();
  }

  /**
   * A `Map` containing all of the players in the World
   * @example
   * const player = world.players.get(client)
   * console.log(player)
   * // { name: 'Jim', location: 'forest' }
   */
  get players() {
    return this.#players;
  }
}

export { World };
