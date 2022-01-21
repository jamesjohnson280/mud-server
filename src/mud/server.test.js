import WebSocket from 'ws';
import { startServer } from './server.js';
import { World } from './World.js';
import { config } from '../config.js';
import { rooms } from './data/rooms.js';

const serverUrl = `ws://localhost:${config.port}`;
const gameWorld = new World(rooms);
let server;

describe('server', () => {
  beforeAll(() => {
    server = startServer(gameWorld, config);
  });

  test('it accepts incoming connections', async () => {
    const mockConnection = jest.fn();
    const client = new WebSocket(serverUrl);
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
    expect(`${data}`).toEqual('Welcome to SocketMud');
  });

  test('it replies to messages it receives', async () => {
    const client = new WebSocket(serverUrl);
    await onMessage(client); /* skip welcome message */
    client.send('Jim');
    const { data } = await onMessage(client);
    client.close();
    expect(/Hello, Jim/gi.test(`${data}`)).toBeTruthy();
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

  afterAll(() => {
    gameWorld.players.clear();
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
