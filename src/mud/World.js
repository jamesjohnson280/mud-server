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
   * const world = new World(rooms);
   * @param {object} rooms An object containing room configuration
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

  /**
   * A `Map` containing all of the rooms in the World
   * @example
   * const room = world.rooms.get('forest');
   * console.log(room);
   * // {
   * //   name: 'The Forest',
   * //   description: 'You are standing in a forest. To the south is a meadow',
   * //   exits: { south: 'meadow' }
   * // }
   */
  get rooms() {
    return this.#rooms;
  }

  /**
   * Returns the default starting room's key
   */
  get startRoom() {
    return this.#rooms.get('start-room');
  }
}

export { World };
