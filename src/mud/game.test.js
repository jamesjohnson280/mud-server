import { notRegistered, registerPlayer } from './game';
import { World } from './World';

describe('game', () => {
  test('it checks if a player is not registered', () => {
    const result = notRegistered({});
    expect(result).toBe(true);
  });

  test('it checks if a player is registered', () => {
    const result = notRegistered({ name: 'Jim' });
    expect(result).toBe(false);
  });

  test('it registers players with the game world', () => {
    const client = { id: 'test-client' };
    const result = registerPlayer(client, new World(), 'Jim');
    expect(result).toEqual('Hello, Jim.');
  });

  test("it reprompts if the user doesn't enter a name", () => {
    const client = { id: 'test-client' };
    const result = registerPlayer(client, new World(), null);
    expect(result).toEqual('Enter your name:');
  });
});
