import { WebSocketServer } from 'ws';
import config from './config.js';

/**
 * The mud server
 */
class Server {
  /** Message that's displayed when a client connects */
  static WelcomeMessage = 'Hello, world!';

  /** Internal websocket client */
  static #wss;

  /** Starts a new server and listens for connections */
  static async start() {
    this.#wss = new WebSocketServer({ port: config.port });

    this.#wss.on('connection', (client) => {
      client.send(Server.WelcomeMessage);

      client.on('message', (data, isBinary) => {
        client.send(data, { binary: isBinary });
      });
    });
  }

  /** Shuts down the server */
  static stop() {
    this.#wss.close();
  }
}

export default Server;
