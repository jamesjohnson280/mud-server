/**
 * Keeps track of all the words the game understands
 * @module Vocabulary
 */

const Emote = Object.freeze({
  token: 'emote',
  type: 'verb'
});

const Walk = Object.freeze({
  token: 'walk',
  type: 'verb'
});

const North = Object.freeze({
  token: 'north',
  type: 'direction'
});

const South = Object.freeze({
  token: 'south',
  type: 'direction'
});

const East = Object.freeze({
  token: 'east',
  type: 'direction'
});

const West = Object.freeze({
  token: 'west',
  type: 'direction'
});

const Up = Object.freeze({
  token: 'up',
  type: 'direction'
});

const Down = Object.freeze({
  token: 'north',
  type: 'direction'
});

const Dictionary = Object.freeze({
  emote: Emote,
  walk: Walk,
  go: Walk,
  run: Walk,
  north: North,
  n: North,
  south: South,
  s: South,
  east: East,
  e: East,
  west: West,
  w: West,
  up: Up,
  u: Up,
  down: Down,
  d: Down
});

export { Dictionary };
