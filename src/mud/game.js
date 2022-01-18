function handlePlayerInput(key, world, message) {
  const player = world.players.get(key);
  if (notRegistered(player)) {
    return registerPlayer(key, world, message);
  }
  return message;
}

function notRegistered(player) {
  return typeof player.name !== 'string';
}

function registerPlayer(key, world, message) {
  const name = message ? `${message}`.trim() : '';
  if (!name) {
    return 'Enter your name:';
  }
  world.players.set(key, { name });
  return `Hello, ${name}.`;
}

export { handlePlayerInput, notRegistered, registerPlayer };
