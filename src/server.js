import express from 'express';

import connect from './persistence';

const log = process.env.BABEL_ENV === 'node-hot' ? console : require('electron-log').default;

let disconnect;
let httpServer;
let app;

async function createServer() {
  const { default: apollo } = await import('./apollo/server');
  const server = express();
  apollo(server);
  return server;
}

export default async function startServer() {
  disconnect = connect();
  app = await createServer();

  await new Promise((resolve, reject) => {
    const startErrorHandler = error => {
      log.error('Unable to start Apollo server', error);
      reject(error);
    };
    log.info('Starting Apollo server...');

    httpServer = app.listen({ port: 4000 }, () => {
      log.info('🚀 Server ready at http://localhost:4000/graphql');
      httpServer.off('error', startErrorHandler);
      resolve();
    });

    httpServer.once('error', startErrorHandler);
  });

  async function stopServer() {
    await new Promise((resolve, reject) => {
      const closeErrorHandler = error => {
        log.error('Unable to stop Apollo server', error);
        reject(error);
      };
      log.info('Stopping Apollo server...');

      if (disconnect) disconnect();

      httpServer.close(() => {
        resolve();
        httpServer.off('error', closeErrorHandler);
      });

      httpServer.once('error', closeErrorHandler);
    });
  }

  return stopServer;
}

(async () => {
  if (module.hot) {
    const cleanup = await startServer();

    // Hot reload for graphql updates
    module.hot.accept(['./apollo/server'], async () => {
      httpServer.off('request', app);
      app = await createServer();
      httpServer.on('request', app);
    });

    // For reload main module (self). It will restart http-server.
    module.hot.accept(error => log.error(error));
    module.hot.dispose(async () => {
      await cleanup();
    });
  }
})();
