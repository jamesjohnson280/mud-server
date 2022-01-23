import WebSocket, { on } from 'ws';
import { startServer } from './server.js';
import { World } from './World.js';
import { config } from '../config.js';
import { rooms } from './data/rooms.js';

const serverUrl = `ws://localhost:${config.port}`;
const world = new World(rooms);
let server;

describe('server', () => {
  beforeAll(() => {
    server = startServer(world, config);
  });

  test('it accepts incoming connections', async () => {
    const client = new WebSocket(serverUrl);
    const mockConnection = jest.fn();

    client.on('open', () => {
      mockConnection();
      client.close();
    });
    await socketState(client, WebSocket.CLOSED);

    expect(mockConnection).toHaveBeenCalled();
  });

  test('it sends a welcome message', async () => {
    const client = new WebSocket(serverUrl);

    const { data } = await onMessage(client);
    client.close();

    expect(/Welcome to SocketMud/gi.test(`${data}`)).toBeTruthy();
  });

  test('it replies to messages it receives', async () => {
    const client = new WebSocket(serverUrl);

    await onMessage(client);
    client.send('Jim');
    const { data } = await onMessage(client);
    client.close();

    expect(/Hello, Jim/gi.test(`${data}`)).toBeTruthy();
  });

  test('messages for the player are not sent to others', async () => {
    const client = new WebSocket(serverUrl);

    await onMessage(client);
    client.send('Jim');
    await onMessage(client);
    client.send('foo');
    const { data } = await onMessage(client);
    client.close();

    expect(/I don't understand/gi.test(`${data}`)).toBeTruthy();
  });

  test('it alerts other players when another takes an action', async () => {
    const brian = new WebSocket(serverUrl);
    await onMessage(brian);
    brian.send('Brian');
    await onMessage(brian);

    const jim = new WebSocket(serverUrl);
    await onMessage(jim);
    jim.send('Jim');

    const { data } = await onMessage(brian);

    jim.close();
    brian.close();

    expect(/Jim has joined the game/gi.test(`${data}`)).toBeTruthy();
  });

  test('it returns an error if the client sends binary data', async () => {
    const client = new WebSocket(serverUrl);
    const buf = new Int32Array();

    await onMessage(client);
    client.send(buf);
    const { data } = await onMessage(client);
    client.close();

    expect(`${data}`).toEqual('Error: Improper message format.');
  });

  test('it removes players when their connection closes', async () => {
    const client = new WebSocket(serverUrl);

    await onMessage(client);
    client.send('John');
    await onMessage(client);
    const size = world.players.size;
    client.close();
    await socketState(client, WebSocket.CLOSED);

    expect(world.players.size).toEqual(size - 1);
  });

  afterAll(() => {
    world.players.clear();
    server.close();
  });
});

function socketState(socket, state) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (socket.readyState === state) {
        resolve();
      } else {
        socketState(socket, state).then(resolve);
      }
    }, 5);
  });
}

function onMessage(client) {
  return new Promise((resolve) => {
    client.on('message', (data, isBinary) => {
      resolve({ data, isBinary });
    });
  });
}
