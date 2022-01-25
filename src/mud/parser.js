import { Commands } from './Commands.js';
import { Dictionary } from './Vocabulary.js';

function parse(world, key, message) {
  const { verb, type, args } = parseVerb(message);
  if (type === 'unknown') {
    return {
      self: `I don't understand the word "${verb}."`
    };
  }

  const player = world.players.get(key);
  return Commands[`${verb}`](verb, args, {
    player,
    world,
    client: key
  });
}

function parseVerb(message) {
  const verb = message.toLowerCase().trim().split(' ')[0];
  const args = message
    .replace(/^(\w+)/i, '')
    .toLowerCase()
    .trim();

  if (!(verb in Dictionary)) {
    return {
      verb,
      type: 'unknown',
      args
    };
  }

  const entry = Dictionary[`${verb}`];
  let _verb = entry.token;
  let _args = args;
  if (entry.type === 'direction') {
    _verb = 'walk';
    _args = Dictionary[`${verb}`].token;
  }
  return {
    verb: _verb,
    type: 'verb',
    args: _args
  };
}

function parseArgs(args) {
  if (!(args in Dictionary)) {
    return {
      token: args,
      type: 'unknown'
    };
  }
  return Dictionary[`${args}`];
}

export { parse, parseVerb, parseArgs };
