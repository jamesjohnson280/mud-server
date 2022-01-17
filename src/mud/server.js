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
  server.on('connection', (client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`Welcome to ${Title}`);
      client.send('');
      client.send('Enter your name:');
      world.players.set(client, {});
    }

    /* Handle player messages */
    client.on('message', (data, isBinary) => {
      /* Skip non-text messages */
      if (isBinary) return;

      const player = world.players.get(client);
      if (!player.name) {
        /* Register new players */
        const p = registerPlayer(client, data, world);
        if (!p) {
          client.send('Enter your name:');
          return;
        }
        client.send(`Hello, ${p.name}.`);
      }
    });
  });

  return server;
}

/**
 * Adds a new player to the game
 * @example
 * const player = registerPlayer(client, 'Jim', world);
 * console.log(player);
 * // { name: 'Jim' }
 * @param {WebSocket} client The player's connection socket
 * @param {string} data The name the player has chosen
 * @param {World} world The game world used by the server @see {@link World}
 * @returns {object} A valid player object
 */
function registerPlayer(client, data, world) {
  const name = `${data}`.trim();
  if (!name) return null;
  const player = { name };
  world.players.set(client, player);
  return player;
}

export { startServer, registerPlayer };
