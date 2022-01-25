/**
 * The game manager
 * @module game
 */
import { parse } from './parser.js';

/**
 * Handles raw player input and returns the message to send back to the client
 * @example
 * const message = handleInput(client, new World(), 'Jim');
 * console.log(message);
 * // { self: 'Hello, Jim', others: 'Jim has entered the game.' }
 * @param {World} world The game World object
 * @param {Any} key The key used to lookup the player in the world.
 * @param {string} message The input to handle
 * @returns An object containing the strings to send back to the players
 */
function handlePlayerInput(world, key, message) {
  const player = world.players.get(key);

  if (notRegistered(player)) {
    return registerPlayer(world, key, message);
  }

  return parse(world, key, message);
}

function notRegistered(player) {
  return !player?.name;
}

function registerPlayer(world, key, message) {
  const player = world.players.get(key);
  const room = world.rooms.get('dirt-road');
  const name = message ? `${message}`.trim() : '';

  if (!name) {
    return { self: 'Enter your name:' };
  }

  world.players.set(key, {
    ...player,
    name,
    location: 'dirt-road'
  });

  const self = `Hello, ${name}. You start off at the:\n\n${room.name}\n${room.description}`;
  const others = `${name} has joined the game.`;
  return { self, others };
}

export { handlePlayerInput };
