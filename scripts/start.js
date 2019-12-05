import fs from 'fs';
import path from 'path';
import electron from 'electron';
import nodemon from 'nodemon';
import waitOn from 'wait-on';
import terminate from 'terminate';

import config from '../webpack.main.babel';

const DEV_PORT = 3000;
const APOLLO_PORT = 4000;
const root = path.resolve(__dirname, '..');
const pidFile = path.resolve(root, 'electron.pid');
const file = path.resolve(config.output.path, config.output.filename);

async function start() {
  console.log('Waiting on development server on port 3000...'); // eslint-disable-line no-console
  await waitOn({ resources: [`http://localhost:${DEV_PORT}`] });
  console.log('Waiting on apollo server on port 4000...'); // eslint-disable-line no-console
  await waitOn({ resources: [`tcp:localhost:${APOLLO_PORT}`] });
  const args = process.argv.length > 2 ? process.argv.slice(2).join(' ') : '';
  const exec = `${electron} ${root} ${args}`;
  console.log('Server found.'); // eslint-disable-line no-console
  nodemon({
    exec,
    watch: file,
    signal: 'SIGINT',
    verbose: true,
  }).on('start', () => {
    console.log('Application started.'); // eslint-disable-line no-console
  }).on('restart', () => {
    const pid = fs.readFileSync(pidFile, { encoding: 'utf8' });
    terminate(pid, 'SIGINT', {}, () => {
      console.log(`Process ${pid} killed.`); // eslint-disable-line no-console
    });
  }).on('log', event => {
    console.log(`[nodemon] ${event.type} - ${event.message}`); // eslint-disable-line no-console
    const key = 'pid:';
    const startIndex = event.message.indexOf(key);
    const pid = startIndex > -1 ? event.message.substring(startIndex + key.length).trim() : null;
    if (pid) {
      fs.writeFileSync(pidFile, pid);
    }
  });
}

start();
