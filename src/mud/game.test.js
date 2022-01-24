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

  test("it reprompts when a player doesn't enter their name", () => {
    world.players.set(key, { name: '' });
    const message = handlePlayerInput(world, key, '');

    expect(/Enter your name/gi.test(message.self)).toBeTruthy();
  });

  test('after registering, it sends the player to the starting room', () => {
    world.players.set(key, { name: '' });
    const message = handlePlayerInput(world, key, 'Jim');

    expect(/Dirt Road/gi.test(message.self)).toBeTruthy();
  });

  test('it handles registered player input', () => {
    world.players.set(key, { name: 'Jim' });
    const message = handlePlayerInput(world, key, 'emote is smiling.');

    const expected = {
      self: 'You emote "is smiling."',
      others: 'Jim is smiling.'
    };
    expect(message).toEqual(expected);
  });

  test("it tells the player when it doesn't understand input", () => {
    world.players.set(key, { name: 'Jim' });
    const message = handlePlayerInput(world, key, 'foo bar');

    const expected = {
      self: 'I don\'t understand the word "foo."'
    };
    expect(message).toEqual(expected);
  });

  test('it expands directions into verbs', () => {
    world.players.set(key, { name: 'Jim' });
    const message = handlePlayerInput(world, key, 'north');

    const expected = {
      self: 'The way is blocked.q'
    };
    expect(message).toEqual(expected);
  });
});
