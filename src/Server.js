import { WebSocketServer } from 'ws';
import config from './config';

class Server {
  static WelcomeMessage = 'Hello, world!';
  static #wss;
  static async start() {
    this.#wss = new WebSocketServer({ port: config.port });
    this.#wss.on('connection', (client) => {
      client.send(Server.WelcomeMessage);

      client.on('message', (data, isBinary) => {
        client.send(data, { binary: isBinary });
      });
    });
  }
  static stop() {
    this.#wss.close();
  }
}

export default Server;
