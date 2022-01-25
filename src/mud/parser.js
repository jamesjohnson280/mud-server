import { Commands } from './commands.js';
import { Dictionary } from './Vocabulary.js';

function parse(world, key, message) {
  const verb = message.toLowerCase().trim().split(' ')[0];
  const args = message
    .replace(/^(\w+)/i, '')
    .toLowerCase()
    .trim();
  const player = world.players.get(key);

  if (verb in Dictionary) {
    let _verb = Dictionary[`${verb}`].token;
    let _args = args;
    if (Dictionary[`${verb}`].type === 'direction') {
      _verb = 'walk';
      _args = Dictionary[`${verb}`].token;
    }

    return Commands[`${_verb}`](_verb, _args, {
      player,
      world,
      client: key
    });
  }
  if (!(verb in Dictionary)) {
    return {
      self: `I don't understand the word "${verb}."`
    };
  }
}

function parseVerb(verb) {}

function parseArgs(args) {}

export { parse, parseVerb, parseArgs };
