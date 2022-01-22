import { emote } from './commands.js';

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
});
