import fs from 'fs';
import path from 'path';
import electron from 'electron';
import nodemon from 'nodemon';
import waitOn from 'wait-on';

import config from '../webpack.main.babel';

const DEV_PORT = 3000;
const KILL_SIGNAL = 'SIGINT';
const root = path.resolve(__dirname, '..');
const mainFile = path.resolve(config.output.path, config.output.filename);

async function start() {
  console.log('Waiting on development server on port 3000...'); // eslint-disable-line no-console
  await waitOn({ resources: [`http://localhost:${DEV_PORT}`] });
  const args = process.argv.length > 2 ? process.argv.slice(2).join(' ') : '';
  const exec = `${electron} ${root} ${args}`;
  console.log('Server found.'); // eslint-disable-line no-console
  nodemon({
    exec,
    watch: mainFile,
    signal: KILL_SIGNAL,
    verbose: true,
  }).on('start', () => {
    console.log('Application started.'); // eslint-disable-line no-console
  }).on('restart', () => {
    console.log('Application restarted.'); // eslint-disable-line no-console
  }).on('log', event => {
    console.log(`[nodemon] (${event.type}) - ${event.message}`); // eslint-disable-line no-console
  });
}

start();
