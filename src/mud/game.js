/**
 * Checks if a player is registered with the server
 * @param {object}} player The player to check is registered
 * @returns `true` if the player is registered
 */
function notRegistered(player) {
  return typeof player.name !== 'string';
}

/**
 * Adds a new player to the game
 * @example
 * const data = {
 *  world: gameWorld,
 *  player: newPlayer,
 *  message: 'Jim'
 * };
 * const player = registerPlayer(client, server, data);
 * console.log(player);
 * // { name: 'Jim' }
 * @param {WebSocket} client The player's connection socket
 * @param {WebSocketServer} server The Mud server
 * @param {object} data An object containing the data to be processed
 */
function registerPlayer(key, world, message) {
  const name = `${message}`.trim();
  if (!message || !name) {
    return 'Enter your name:';
  }
  world.players.set(key, { name });
  return `Hello, ${name}.`;
}

export { notRegistered, registerPlayer };
