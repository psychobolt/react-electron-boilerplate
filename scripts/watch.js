import findProcess from 'find-process';
import waitOn from 'wait-on';

async function watch() {
  await waitOn({ resources: ['http://localhost:3000'] });
  await new Promise(resolve => (async function poll() {
    await findProcess('name', 'scripts/start.js').then(async processes => {
      if (processes.length) {
        setTimeout(poll, 250);
      } else {
        await require('./kill'); // eslint-disable-line global-require
        resolve('App is terminated');
      }
    });
  }()));
}

export default watch();
