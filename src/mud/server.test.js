import { WebSocket } from 'ws';
import { startServer } from './server.js';
import { config } from '../config.js';

let server;

describe('server', () => {
  beforeAll(() => {
    server = startServer(config);
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
    let message;
    client.on('message', (data, isBinary) => {
      if (isBinary) return;
      message = `${data}`;
      client.close();
    });
    await socketState(client, WebSocket.CLOSED);
    expect(message).toEqual('Welcome to SocketMud');
  });

  afterAll(() => server.close());
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
