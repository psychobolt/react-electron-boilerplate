import findProcess from 'find-process';
import terminate from 'terminate';

import config from '../package.json';

const SIGNAL = 'SIGINT';

async function kill() {
  await findProcess('name', process.platform === 'win32' ? 'electron.exe' : '.bin/electron').then(async processes1 => {
    if (!processes1.length) {
      await findProcess('name', 'concurrently').then(processes2 => {
        const process = processes2.find(({ cmd }) => cmd.indexOf(config.scripts['build:dev']) > -1);
        if (process) {
          terminate(process.pid, SIGNAL);
        }
      });
      await findProcess('name', 'scripts/start.js').then(processes3 => processes3.forEach(({ pid }) => terminate(pid, SIGNAL)));
    }
  });
}

kill();
