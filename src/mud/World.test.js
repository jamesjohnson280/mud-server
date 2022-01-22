import { World } from './World.js';
import { rooms } from './data/rooms.js';

describe('World', () => {
  test('Creating the World initializes players', () => {
    const world = new World();
    expect(world.players instanceof Map).toBeTruthy();
  });

  test('Creating the World initializes room data', () => {
    const numRooms = Object.keys(rooms).length;
    const world = new World(rooms);
    expect(world.rooms.size).toBe(numRooms);
  });

  test('The World contains the default starting room', () => {
    const world = new World(rooms);
    const start = world.startRoom;
    expect(start).toEqual(rooms['start-room']);
  });
});
