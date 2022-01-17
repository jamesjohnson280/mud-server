/**
 * Starts the Mud server
 * @module main
 */
import { config } from './config.js';
import { startServer } from './mud/server.js';

/** The Mud server's CLI entry point */
function main() {
  startServer(config);
}

main();
