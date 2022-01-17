import { World } from './World.js';

describe('World', () => {
  test('Creating the world initializes players', () => {
    const world = new World();
    expect(world.players instanceof Map).toBeTruthy();
  });
});
