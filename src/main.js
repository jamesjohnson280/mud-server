/**
 * Starts the Mud server
 * @module main
 */
import { config } from './config.js';
import { startServer } from './mud/server.js';
import { World } from './mud/World.js';

/** The Mud server's CLI entry point */
function main() {
  const gameWorld = new World();
  startServer(gameWorld, config);
}

main();
