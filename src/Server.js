/**
 * @module Server
 */
import { WebSocketServer } from 'ws';
import { config } from './config.js';

let _wss;

/** The mud server */
const Server = Object.freeze({
  /** Starts the server */
  start: () => {
    _wss = new WebSocketServer({ port: config.port });
    _wss.on('connection', (client) => {
      client.send(Server.WelcomeMessage);

      client.on('message', (data, isBinary) => {
        client.send(data, { binary: isBinary });
      });
    });
  },

  /** Stops the server */
  stop: () => {
    _wss.close();
  }
});

export { Server };
