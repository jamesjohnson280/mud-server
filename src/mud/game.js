/**
 * The game module
 * @module game
 */
import { emote } from './commands.js';

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
    const self = `${buf}${buf2}`;
    const p = world.players.get(key);
    const others = `${p.name} has joined the game`;
    return reply(self, others);
  }

  return parse(world, key, message);
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
  const room = world.rooms.get('dirt-road');

  world.players.set(key, { ...player, seenIntro: true, location: 'dirt-road' });
  return ` You start off at the:\n\n${room.name}\n${room.description}`;
}

function reply(self, others) {
  return {
    self,
    others: others || undefined
  };
}

function parse(world, key, message) {
  const verb = message.toLowerCase().trim().split(' ')[0];
  const args = message.replace(/emote/gi, '').toLowerCase().trim();
  const player = world.players.get(key);

  if (verb === 'emote') {
    return emote(verb, args, {
      player
    });
  }
  return {
    self: `I don't understand the word "${verb}."`
  };
}

export { handlePlayerInput };
