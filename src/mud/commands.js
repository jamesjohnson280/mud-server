/**
 * All the commands available to players
 * @module commands
 */

/**
 * Broadcasts an emote to every player in a room
 * @param {string} verb The verb used to invoke the command
 * @param {string} args The text after the verb in the player's input string
 * @param {object} context An object containing the player, world and other contextual data
 * @returns And object containing the outcome of the command to be broadcast to the players
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

export { emote };
