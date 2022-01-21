/**
 * All the commands available to players
 * @module commands
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
