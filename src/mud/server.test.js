import { WebSocket } from 'ws';
import { startServer } from './server.js';
import { World } from './World.js';
import { config } from '../config.js';

const gameWorld = new World();
let server;

describe('server', () => {
  beforeAll(() => {
    server = startServer(gameWorld, config);
  });

  test('it accepts incoming connections', async () => {
    const mockConnection = jest.fn();
    const client = new WebSocket(`ws://localhost:${config.port}`);
    client.on('open', () => {
      mockConnection();
      client.close();
    });
    await socketState(client, WebSocket.CLOSED);
    expect(mockConnection).toHaveBeenCalled();
  });

  test('it sends a welcome message', async () => {
    const client = new WebSocket(`ws://localhost:${config.port}`);
    const expected = 'Welcome to SocketMud';
    let message;
    client.on('message', (data, isBinary) => {
      if (isBinary) return;
      const msg = `${data}`;
      if (msg === expected) {
        message = msg;
      }
      client.close();
    });
    await socketState(client, WebSocket.CLOSED);
    expect(message).toEqual(expected);
  });

  test('it replies to messages it receives', async () => {
    const client = new WebSocket(`ws://localhost:${config.port}`);
    const expected = 'Hello, Jim.';
    let message;
    client.on('message', (data, isBinary) => {
      if (isBinary) return;
      const msg = `${data}`;
      console.log(msg, 'msg');
      if (msg === expected) {
        message = msg;
      } else {
        client.send('Jim');
      }
      client.close();
    });
    await socketState(client, WebSocket.CLOSED);
    expect(message).toEqual(expected);
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
