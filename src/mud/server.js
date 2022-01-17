/**
 * The Mud server
 * @module server
 */
import { WebSocket, WebSocketServer } from 'ws';
import { Title, Version } from './constants.js';

/**
 * Starts the Mud server
 * @example
 * // Starts the server on port 80
 * const config = { port: 80 }
 * startServer(config);
 * @param {object} config Startup configuration for the server. @see {@link module:config}
 * @returns {WebSocketServer} A reference to the WebSocket server
 */
function startServer(config) {
  const server = new WebSocketServer({ port: config.port });
  console.log(`${Title} v${Version}`);
  console.log(`Listening on port ${config.port}`);

  /* Accept connections */
  server.on('connection', (client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`Welcome to ${Title}`);
    }
  });

  return server;
}

export { startServer };
