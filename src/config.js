/** @module config */

/**
 * The mud server's configuration
 * @example
 * const config = Object.freeze({
 *   port: 8080
 * });
 */
const config = Object.freeze({
  /** Port to serve the mud on. Defaults to 8080 */
  port: 8080
});

export { config };
