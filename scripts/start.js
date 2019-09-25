import path from 'path';
import electron from 'electron';
import nodemon from 'nodemon';
import waitOn from 'wait-on';

import config from '../webpack.main.babel';

const DEV_PORT = 3000;
const root = path.resolve(__dirname, '..');
const file = path.resolve(config.output.path, config.output.filename);

async function start() {
  console.log('Waiting on development server on port 3000...'); // eslint-disable-line no-console
  await waitOn({ resources: [`tcp:localhost:${DEV_PORT}`] });
  const args = process.argv.length > 2 ? process.argv.slice(2).join(' ') : '';
  const exec = `${electron} ${root} ${args}`;
  console.log( // eslint-disable-line no-console
    `Server found. Starting Electron app with watch mode. Watching file ${file}\
    \n> ${exec}\
    `,
  );
  nodemon({
    exec,
    watch: file,
    stdout: true,
  }).on('start', () => {
    console.log('Application started.'); // eslint-disable-line no-console
  });
}

start();
