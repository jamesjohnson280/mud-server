/**
 * The Mud server
 * @module server
 */
import { WebSocket, WebSocketServer } from 'ws';
import { Title, Version } from './constants.js';
import { handlePlayerInput } from './game.js';

/**
 * Starts the Mud server
 * @example
 * // Starts the server on port 80
 * const world = new World();
 * const config = { port: 80 }
 * startServer(world, config);
 * @param {World} world An instance of the game world @see {@link World}
 * @param {object} config Startup configuration for the server. @see {@link module:config}
 * @returns {WebSocketServer} A reference to the WebSocket server
 */
function startServer(world, config) {
  const server = new WebSocketServer({ port: config.port });
  console.log(`${Title} v${Version}`);
  console.log(`Listening on port ${config.port}`);

  /* Accept connections */
  server.on('connection', (client) => onConnection(client, server, world));

  return server;
}

function onConnection(client, server, world) {
  /* First Send a welcome message */
  if (client.readyState === WebSocket.OPEN) {
    client.send(`Welcome to ${Title}`);
    client.send('');
    client.send('Enter your name:');
    world.players.set(client, {});
  }

  /* Then set up to handle client messages */
  client.on('message', (data, isBinary) => {
    const sanitized = sanitizeData(data, isBinary);
    const reply = handlePlayerInput(world, client, sanitized);
    client.send(reply.self);
    server.clients.forEach((cl) => {
      if (cl !== client) {
        if (cl.readyState == WebSocket.OPEN) {
          cl.send(reply.others);
        }
      }
    });
  });
}

function sanitizeData(data, isBinary) {
  if (isBinary) return null;
  const message = `${data}`;
  return message;
}

export { startServer };
