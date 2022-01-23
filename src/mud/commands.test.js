import { World } from './World.js';
import { emote, walk } from './commands.js';
import { rooms } from './data/rooms.js';

describe('commands', () => {
  describe('emote', () => {
    test('displays player defined text', () => {
      const verb = 'emote';
      const args = 'is smiling.';
      const context = {
        player: {
          name: 'Jim'
        }
      };
      const result = emote(verb, args, context);

      const expected = {
        self: 'You emote "is smiling."',
        others: 'Jim is smiling.'
      };
      expect(result).toEqual(expected);
    });

    test('displays a default message', () => {
      const verb = 'emote';
      const args = '';
      const context = {
        player: {
          name: 'Jim'
        }
      };
      const result = emote(verb, args, context);

      const expected = {
        self: 'You emote.',
        others: 'Jim emotes.'
      };
      expect(result).toEqual(expected);
    });
  });

  describe('walk', () => {
    test('it moves players to a connected room', () => {
      const verb = 'walk';
      const args = 'west';
      const world = new World(rooms);
      const context = {
        client: { id: 'jim' },
        player: {
          name: 'Jim',
          location: 'dirt-road'
        },
        world
      };
      const result = walk(verb, args, context);

      const expected = {
        self: `\n${rooms.inn.name}\n${rooms.inn.description}`,
        others: 'Jim went west.'
      };
      expect(result).toEqual(expected);
    });

    test('it blocks movement if there is no exit', () => {
      const verb = 'walk';
      const args = 'east';
      const world = new World(rooms);
      const context = {
        client: { id: 'jim' },
        player: {
          name: 'Jim',
          location: 'dirt-road'
        },
        world
      };
      const result = walk(verb, args, context);

      const expected = {
        self: 'The way is blocked.'
      };
      expect(result).toEqual(expected);
    });
  });
});
