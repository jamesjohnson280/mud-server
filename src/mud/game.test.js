import { handlePlayerInput } from './game';
import { World } from './World';
import { rooms } from './data/rooms';

const world = new World(rooms);
const key = { id: 'jim' };

describe('game', () => {
  test('it registers new players', () => {
    const message = handlePlayerInput(world, key, 'Jim');
    expect(/Hello, Jim./gi.test(message.self)).toBeTruthy();
  });

  test('after registering, it sends the player to the starting room', () => {
    world.players.set(key, { name: '' });
    const message = handlePlayerInput(world, key, 'Jim');
    expect(/Dirt Road/gi.test(message.self)).toBeTruthy();
  });

  test('it handles registered player input', () => {
    world.players.set(key, { name: 'Jim' });
    const message = handlePlayerInput(world, key, 'hi');
    expect(message.self).toBe('hi');
  });
});
