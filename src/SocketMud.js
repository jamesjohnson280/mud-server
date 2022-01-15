import { WebSocketServer, WebSocket } from 'ws';

function startMud() {
  const server = new WebSocketServer({ port: 8080 });
  const players = new Map();

  console.log('SocketMud listening on ws://localhost:8080');
  server.on('connection', (client) => {
    players.set(client, {});
    client.send('What is your name?');

    client.on('message', (data, isBinary) => {
      if (isBinary) return;
      const player = players.get(client);
      if (!player.name) {
        const p = newPlayer(data, server, client, player);
        players.set(client, { ...p });
      } else {
        client.send(`Echo: ${data}`);
      }
    });

    client.on('close', () => {
      const player = players.get(client);
      console.log(`${player.name} disconnected`);
      server.clients.forEach((c) => {
        if (c !== client && c.readyState === WebSocket.OPEN) {
          c.send(`${player.name} left the game.`);
        }
      });
      players.delete(client);
    });
  });
}

function newPlayer(data, server, client, player) {
  player.name = `${data}`;
  console.log(`${player.name} connected`);
  server.clients.forEach((c) => {
    if (c !== client && c.readyState === WebSocket.OPEN) {
      c.send(`${player.name} has joined the game.`);
    }
    if (c === client) {
      c.send(`Hello, ${player.name}!`);
    }
  });
  return player;
}

export { startMud };
