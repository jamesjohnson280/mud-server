#!/home/jim/.nvm/versions/node/v16.13.0/bin/node

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ws = require('ws');
const WebSocket = ws.WebSocket;

const client = new WebSocket('ws://localhost:8080');

client.on('open', () => {
  /* Set up readline to capture input and send it to server*/
  readline.on('line', (s) => {
    client.send(s);
  });

  /* Shut down when user presses CTRL-C */
  readline.on('SIGINT', () => {
    client.close();
    readline.removeAllListeners();
    readline.close();
  });

  /* Prompt for input */
  readline.setPrompt('>');
  readline.prompt(true);
});

client.on('message', (data, isBinary) => {
  /* Clear the current line */
  process.stdout.clearLine();
  process.stdout.cursorTo(0);

  /* Write incoming message to console */
  process.stdout.write(`${data}\n`);

  /* Restore the prompt */
  readline.prompt(true);
});
