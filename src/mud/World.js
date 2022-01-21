/**
 * The World manager
 * @module World
 */

/** The game world */
class World {
  #players;
  #rooms;

  /**
   * Creates a new instance of the World
   * @example
   * const world = new World();
   */
  constructor(rooms = {}) {
    this.#players = new Map();
    this.#rooms = new Map(Object.entries(rooms));
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

  get rooms() {
    return this.#rooms;
  }
}

export { World };
