import electron from 'electron';
import findProcess from 'find-process';
import waitOn from 'wait-on';
import wait from 'waait';

async function watch() {
  await waitOn({ resources: ['http://localhost:3000'] });
  await new Promise(resolve => (async function poll() {
    await wait(250);
    await findProcess('name', 'scripts/start.js').then(async () => {
      await findProcess('name', electron.replace(/\\/g, '\\\\')).then(async processes => {
        if (processes.length) {
          poll();
        } else {
          await require('./kill'); // eslint-disable-line global-require
          resolve('App is terminated');
        }
      });
    });
  }()));
}

export default watch();
