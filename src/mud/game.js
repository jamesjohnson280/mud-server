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
 * @param {World} world The game World object
 * @param {Any} key The key used to lookup the player in the world.
 * @param {string} message The input to handle
 * @returns A string containing the result of processing the input to be send back to the player
 */
function handlePlayerInput(world, key, message) {
  const player = world.players.get(key);
  if (notRegistered(player)) {
    const buf = registerPlayer(world, key, message);
    const buf2 = doIntro(world, key);
    return `${buf}${buf2}`;
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

function registerPlayer(world, key, message) {
  const name = message ? `${message}`.trim() : '';
  if (!name) {
    return 'Enter your name:';
  }
  world.players.set(key, { name });
  return `Hello, ${name}.`;
}

function doIntro(world, key) {
  const player = world.players.get(key);
  world.players.set(key, { ...player, seenIntro: true, location: 'dirt-road' });
  const room = world.rooms.get('dirt-road');
  return ` You start off at the:\n\n${room.name}\n${room.description}`;
}

export { handlePlayerInput };
