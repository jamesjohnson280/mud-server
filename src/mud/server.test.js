import { WebSocket } from 'ws';
import { startServer, registerPlayer } from './server.js';
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

  describe('it registers new players', () => {
    test('it asks for a name when a player connnects', async () => {
      const client = new WebSocket(`ws://localhost:${config.port}`);
      const expected = 'Hello, Jim.';
      let message;
      client.on('message', (data, isBinary) => {
        if (isBinary) return;
        const msg = `${data}`;
        if (msg === 'Enter your name:') {
          client.send('Jim');
        }
        if (msg === expected) {
          message = msg;
          client.close();
        }
      });
      await socketState(client, WebSocket.CLOSED);
      expect(message).toEqual(expected);
    });

    test("it  reprompts if the player doesn'nt enter a name", async () => {
      const client = new WebSocket(`ws://localhost:${config.port}`);
      const expected = 'Enter your name:';
      let message;
      let sent = false;
      client.on('message', (data, isBinary) => {
        if (isBinary) return;
        const msg = `${data}`;
        if (msg === expected) {
          if (!sent) {
            client.send('');
            sent = true;
            return;
          }
          if (sent) {
            message = msg;
            client.close();
          }
        }
      });
      await socketState(client, WebSocket.CLOSED);
      expect(message).toEqual(expected);
    });

    test('adds the player to the game world', () => {
      const client = { id: 'test-client' };
      const player = registerPlayer(client, 'Jim', gameWorld);
      expect(gameWorld.players.get(client).name).toEqual(player.name);
    });
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
