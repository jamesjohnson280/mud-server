/**
 * Starts the Mud server
 * @module main
 */
import { config } from './config.js';
import { startServer } from './mud/server.js';
import { World } from './mud/World.js';
import { rooms } from './mud/data/rooms.js';

/** The Mud server's CLI entry point */
function main() {
  const gameWorld = new World(rooms);
  startServer(gameWorld, config);
}

main();
