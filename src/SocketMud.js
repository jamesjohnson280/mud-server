import { WebSocketServer, WebSocket } from 'ws';

const Rooms = Object.freeze({
  road: {
    name: 'Dusty Road',
    description:
      'You are standing in the middle of a dusty road. To the west is an inn.',
    exits: {
      west: 'inn'
    }
  },
  inn: {
    name: 'The Weary Traveler Inn',
    description:
      'A beacon of light to the weary traveler. This inn promises ale, hot food and rest. To the east is the road.',
    exits: {
      east: 'road'
    }
  }
});

function startMud() {
  const server = new WebSocketServer({ port: 8080 });
  const players = new Map();

  console.log('SocketMud listening on ws://localhost:8080');
  server.on('connection', (client) => {
    /* Log player in on connection */
    players.set(client, {});
    client.send('What is your name?');

    /* Receive messages */
    client.on('message', (data, isBinary) => {
      /* Skip non-text messages */
      if (isBinary) return;

      const player = players.get(client);
      /* If player has no name, log them in */
      if (!player.name) {
        const p = newPlayer(data, server, client, player, players);
        players.set(client, { ...p });
      } else {
        /* else parse their command */
        parse(client, server, {
          players,
          command: `${data}`
        });
      }
    });

    /* Player disconnects */
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

function newPlayer(data, server, client, player, players) {
  player.name = `${data}`;
  player.location = 'road';
  console.log(`${player.name} connected`);
  server.clients.forEach((c) => {
    if (c !== client && c.readyState === WebSocket.OPEN) {
      c.send(`${player.name} has joined the game.`);
    }
    if (c === client) {
      c.send(`Hello, ${player.name}!`);
    }
  });
  roomDescription(client, player, players);
  return player;
}

function parse(client, server, state) {
  const { command, players } = state;
  const player = players.get(client);
  const verb = command.toLowerCase().split(' ')[0].trim();
  console.log('command:', verb);
  if (!verb) {
    client.send('Beg your pardon?');
    return;
  }
  switch (verb) {
    case 'look':
      roomDescription(client, player, players);
      break;
    case 'wait':
      client.send('Time passes...');
      break;
    case 'north':
    case 'south':
    case 'east':
    case 'west':
      const p = move(client, server, { player, players, verb, command });
      players.set(client, { ...p });
      break;
    case 'say':
      say(client, server, { player, players, verb, command });
      break;
    default:
      client.send("I don't understand that command.");
      break;
  }
}

function roomDescription(client, player, players) {
  console.log('player:', player);
  console.log('players:', players);
  const room = Rooms[player.location];
  client.send(`\n${room.name}`);
  client.send(room.description);
  players.forEach((p) => {
    if (p.location === player.location && p.name !== player.name) {
      client.send(`${p.name} is here.`);
    }
  });
}

function move(client, server, state) {
  const { player, players, verb } = state;
  const room = Rooms[player.location];
  const dest = room.exits[verb];
  if (!dest) {
    client.send("You can't go that way");
    return;
  }
  console.log('destination:', dest);
  server.clients.forEach((c) => {
    if (c !== client && c.readyState === WebSocket.OPEN) {
      const p = players.get(c);
      if (p.location === player.location) {
        c.send(`${player.name} went ${verb}.`);
      }
      if (p.location === dest) {
        c.send(`${player.name} has entered the room.`);
      }
    }
  });
  player.location = dest;
  roomDescription(client, player, players);
  return player;
}

function say(client, server, state) {
  const { players, player, command } = state;
  const message = command.replace(/^(say)/gi, '').trim();
  client.send(`You: "${message}"`);
  server.clients.forEach((c) => {
    if (c !== client && c.readyState === WebSocket.OPEN) {
      const p = players.get(c);
      if (p.location === player.location) {
        c.send(`${player.name}: "${message}"`);
      }
    }
  });
}

export { startMud };
