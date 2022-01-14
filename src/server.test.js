import { WebSocket } from 'ws';
import config from './config';
import Server from './Server';

describe('server', () => {
  beforeAll(async () => {
    await Server.start();
  });
  afterAll(() => {
    Server.stop();
  });

  test('accepts connections', async () => {
    const client = await startClient();
    const mockOpen = jest.fn();

    client.on('open', mockOpen);
    await waitForClientState(client, WebSocket.OPEN);
    expect(mockOpen).toHaveBeenCalled();
    client.close();
  });

  test('sends a welcome message', async () => {
    const client = await startClient();
    let message;

    client.on('message', (data) => {
      message = `${data}`;
      client.close();
    });
    await waitForClientState(client, WebSocket.CLOSED);
    expect(message).toBe(Server.WelcomeMessage);
  });
});

async function startClient() {
  return new WebSocket(`ws://localhost:${config.port}`);
}

async function waitForClientState(client, state) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      if (client.readyState === state) {
        resolve();
      } else {
        waitForClientState(client, state).then(resolve);
      }
    }, 5);
  });
}
