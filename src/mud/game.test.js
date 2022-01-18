import { handlePlayerInput } from './game';
import { World } from './World';

describe('game', () => {
  test('it registers new players', () => {
    const message = handlePlayerInput({}, new World(), 'Jim');
    expect(message).toBe('Hello, Jim.');
  });

  test('it registers new players', () => {
    const message = handlePlayerInput({}, new World(), 'Jim');
    expect(message).toBe('Hello, Jim.');
  });

  test('it handles registered player input', () => {
    const world = new World();
    const key = { id: 'jim' };
    world.players.set(key, { name: 'Jim' });
    const message = handlePlayerInput(key, world, 'hi');
    expect(message).toBe('hi');
  });
});
