import path from 'path';
import electron from 'electron';
import nodemon from 'nodemon';
import waitOn from 'wait-on';
import findProcess from 'find-process';
import terminate from 'terminate';

import config from '../webpack.main.babel';

const DEV_PORT = 3000;
const APOLLO_PORT = 4000;
const KILL_SIGNAL = 'SIGINT';
const root = path.resolve(__dirname, '..');
const mainFile = path.resolve(config.output.path, config.output.filename);

let restarting = false;

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
    watch: mainFile,
    signal: KILL_SIGNAL,
    verbose: true,
  })
    .on('start', () => {
      console.log('Application started.'); // eslint-disable-line no-console
    })
    .on('restart', () => {
      restarting = true;
    })
    .on('log', event => {
      console.log(`[nodemon] (${event.type}) ${event.message}`); // eslint-disable-line no-console
      if (restarting) {
        if (event.type === 'status' && event.message.indexOf('still waiting for') > -1) {
          findProcess('name', electron.replace(/\\/g, '\\\\')).then(processes => {
            processes.forEach(({ pid }) => {
              terminate(pid, KILL_SIGNAL);
            });
          });
        }
        if (event.type === 'detail' && event.message.indexOf('child pid') > -1) {
          restarting = false;
          console.log('Application restarted.'); // eslint-disable-line no-console
        }
      }
    })
    .on('crash', async () => {
      process.exit();
    });
}

start();
