import { parse } from './parser.js';
import { World } from './World.js';
import { rooms } from './data/rooms.js';

describe('parser', () => {
  test('it parses commands', () => {
    const world = new World(rooms);
    const key = { id: 'jim' };
    world.players.set(key, { name: 'Jim' });
    const result = parse(world, key, 'emote is sad');
    const expected = {
      self: 'You emote "is sad"',
      others: 'Jim is sad'
    };
    expect(result).toEqual(expected);
  });
});
