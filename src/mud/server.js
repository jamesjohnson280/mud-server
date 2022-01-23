/**
 * The Mud server
 * @module server
 */
import WebSocket, { WebSocketServer } from 'ws';
import { Title, Version } from './constants.js';
import { handlePlayerInput } from './game.js';

/**
 * Starts the Mud server
 * @example
 * // Starts the server on port 80
 * const world = new World(rooms);
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
    client.send(`Welcome to ${Title}\nEnter your name:`);
    world.players.set(client, {});
  }

  /* Then set up to handle client messages */
  client.on('message', (data, isBinary) => {
    const sanitized = sanitizeData(data, isBinary);
    if (sanitized?.error) {
      client.send(`Error: ${sanitized.error}`);
      return;
    }

    const reply = handlePlayerInput(world, client, sanitized);
    broadCast(client, server, reply);
  });

  /* Remove disconnected players */
  client.on('close', () => {
    world.players.delete(client);
  });
}

function sanitizeData(data, isBinary) {
  if (isBinary) {
    return { error: 'Improper message format.' };
  }

  const message = `${data}`;
  return message;
}

function broadCast(client, server, message) {
  client.send(message.self);

  if (!message.others) {
    return;
  }
  server.clients.forEach((cl) => {
    if (cl !== client) {
      if (cl.readyState == WebSocket.OPEN) {
        cl.send(message.others);
      }
    }
  });
}

export { startServer };
