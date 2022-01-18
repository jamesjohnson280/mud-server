/**
 * The game module
 * @module game
 */

/**
 * Handles raw player input and returns the message to send back to the client
 * @example
 * const message = handleInput(client, new World(), 'Jim');
 * console.log(message);
 * // 'Hello, Jim'
 * @param {Any} key The key used to lookup the player in the world.
 * @param {World} world The game World object
 * @param {string} message The input to handle
 * @returns A string containing the result of processing the input to be send back to the player
 */
function handlePlayerInput(key, world, message) {
  const player = world.players.get(key);
  if (notRegistered(player)) {
    return registerPlayer(key, world, message);
  }
  return message;
}

function notRegistered(player) {
  if (!player) return true;
  if (player.name && typeof player.name === 'string') {
    return false;
  }
  return true;
}

function registerPlayer(key, world, message) {
  const name = message ? `${message}`.trim() : '';
  if (!name) {
    return 'Enter your name:';
  }
  world.players.set(key, { name });
  return `Hello, ${name}.`;
}

export { handlePlayerInput };
