import electron from 'electron';
import findProcess from 'find-process';
import terminate from 'terminate';

import config from '../package.json';

const SIGNAL = 'SIGINT';

async function kill() {
  let terminated = false;
  await findProcess('name', electron.replace(/\\/g, '\\\\')).then(processes1 => {
    processes1.forEach(({ pid }) => {
      terminate(pid, SIGNAL);
      terminated = true;
    });
  });
  await findProcess('name', 'concurrently').then(processes2 => {
    const watchProcess = processes2.find(({ cmd }) => cmd.indexOf(config.scripts['build:dev']) > -1);
    if (watchProcess) {
      terminate(watchProcess.pid, SIGNAL);
      terminated = true;
    }
  });
  await findProcess('name', 'scripts/start.js').then(processes3 => processes3.forEach(({ pid }) => {
    if (process.pid !== pid) {
      terminate(pid, SIGNAL);
      terminated = true;
    }
  }));
  console.log(terminated ? 'Development processes terminated.' : 'No cleanup action performed.'); // eslint-disable-line no-console
}

export default kill();
