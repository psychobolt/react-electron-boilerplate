import path from 'path';
import nodemon from 'nodemon';
import waitOn from 'wait-on';

import config from '../webpack.main.babel';

const DEV_PORT = 3000;
const root = path.resolve(__dirname, '..');
const file = path.resolve(config.output.path, config.output.filename);

console.log('Waiting on development server on port 3000...'); // eslint-disable-line no-console

waitOn(
  { resources: [`tcp:localhost:${DEV_PORT}`] },
  () => {
    const exec = `electron ${root} ${process.argv.slice(2).join(' ')}`;
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
    }).on('quit', () => {
      console.log('Application stopped.'); // eslint-disable-line no-console
    });
  },
);
