/** @module MudServer */
import { WebSocketServer } from 'ws';
import { config } from './config.js';

let _wss;

/** The mud server */
const MudServer = Object.freeze({
  /** Starts the game and accepts connections from players */
  start: () => {
    _wss = new WebSocketServer({ port: config.port });
    _wss.on('connection', (client) => {
      client.send('Hello, world!');

      client.on('message', (data, isBinary) => {
        client.send(data, { binary: isBinary });
      });
    });
  },

  /** Shuts down the game */
  stop: () => {
    _wss.close();
  }
});

export { MudServer };
