/**
 * All the commands available to players
 * @module commands
 */

/**
 * Broadcasts an emote to every player in a room
 * @param {string} verb The verb used to invoke the command
 * @param {string} args The text after the verb in the player's input string
 * @param {object} context An object containing the player, world and other contextual data
 * @returns An object containing the outcome of the command to be broadcast to the players
 */
function emote(verb, args, context) {
  const { player } = context;

  if (!args) {
    return {
      self: 'You emote.',
      others: `${player.name} emotes.`
    };
  }

  return {
    self: `You emote "${args}"`,
    others: `${player.name} ${args}`
  };
}

function walk(verb, args, context) {
  const { client, player, world } = context;
  const direction = args;
  if (!direction) {
    return {
      self: 'Which direction would you like to go?'
    };
  }

  const room = world.rooms.get(player.location);
  const destKey = room.exits[`${direction}`];
  if (!destKey) {
    return {
      self: 'The way is blocked.'
    };
  }

  const destRoom = world.rooms.get(destKey);
  world.players.set(client, { ...player, location: destKey });
  return {
    self: `\n${destRoom.name}\n${destRoom.description}`,
    others: `${player.name} went ${direction}.`
  };
}

const Commands = Object.freeze({
  emote,
  walk
});

export { Commands, emote, walk };
