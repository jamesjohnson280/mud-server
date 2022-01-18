import { handlePlayerInput } from './game';
import { World } from './World';
import { rooms } from './data/rooms';

describe('game', () => {
  test('it registers new players', () => {
    const message = handlePlayerInput(new World(rooms), {}, 'Jim');
    expect(/Hello, Jim./gi.test(message)).toBeTruthy();
  });

  test('after registering, it sends the player to the starting room', () => {
    const world = new World(rooms);
    world.players.set({ id: 'jim' }, { name: 'Jim' });
    const message = handlePlayerInput(world, { id: 'jim' }, 'Jim');
    expect(/Dirt Road/gi.test(message)).toBeTruthy();
  });

  test('it handles registered player input', () => {
    const world = new World();
    const key = { id: 'jim' };
    world.players.set(key, { name: 'Jim' });
    const message = handlePlayerInput(world, key, 'hi');
    expect(message).toBe('hi');
  });
});
