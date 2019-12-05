import fs from 'fs';
import path from 'path';
import findProcess from 'find-process';
import terminate from 'terminate';

import config from '../package.json';

const SIGNAL = 'SIGINT';
const root = path.resolve(__dirname, '..');
const pidFile = path.resolve(root, 'electron.pid');
const debug = process.argv.indexOf('--debugger') > -1;
const apollo = process.argv.indexOf('--apollo') > -1;

async function kill() {
  const electronPID = fs.readFileSync(pidFile, { encoding: 'utf8' });
  await findProcess('pid', electronPID).then(async processes1 => {
    let terminated = false;

    async function killApollo() {
      await findProcess('port', 9229).then(processes => processes.forEach(({ pid }) => {
        terminate(pid, SIGNAL);
        terminated = true;
      }));
    }

    if (apollo) {
      await killApollo();
    } else if ((debug && !processes1.length) || !debug) {
      if (!debug) {
        processes1.forEach(({ pid }) => {
          terminate(pid, SIGNAL);
          terminated = true;
        });
      }
      await findProcess('name', 'concurrently').then(processes2 => {
        const process = processes2.find(({ cmd }) => cmd.indexOf(config.scripts['build:dev']) > -1);
        if (process) {
          terminate(process.pid, SIGNAL);
          terminated = true;
        }
      });
      await findProcess('name', 'scripts/start.js').then(processes3 => processes3.forEach(({ pid }) => {
        terminate(pid, SIGNAL);
        terminated = true;
      }));
      if (!debug) {
        await killApollo();
      }
    }
    console.log(terminated ? 'Development processes terminated.' : 'No action performed.'); // eslint-disable-line no-console
  });
}

kill();
