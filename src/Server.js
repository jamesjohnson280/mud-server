import { WebSocketServer } from 'ws';
import { config } from './config.js';

let _wss;

const Server = Object.freeze({
  start: () => {
    _wss = new WebSocketServer({ port: config.port });
    _wss.on('connection', (client) => {
      client.send(Server.WelcomeMessage);

      client.on('message', (data, isBinary) => {
        client.send(data, { binary: isBinary });
      });
    });
  },
  stop: () => {
    _wss.close();
  }
});

export { Server };
