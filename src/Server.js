import { WebSocketServer } from 'ws';
import config from './config';

class Server {
  static #wss;
  static async start() {
    this.#wss = new WebSocketServer({ port: config.port });
  }
  static stop() {
    this.#wss.close();
  }
}

export default Server;
