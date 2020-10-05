import test from 'ava';
import electronPath from 'electron';
import { Application } from 'spectron';
import path from 'path';

const appPath = path.join(__dirname, '..');

test.beforeEach(async t => {
  t.context.app = new Application({ // eslint-disable-line no-param-reassign
    path: electronPath,
    args: [appPath],
    env: {
      SKIP_SPLASH: true,
    },
  });

  await t.context.app.start();
});

test.afterEach.always(async t => {
  await t.context.app.stop();
});

test('Launch', async t => {
  const { app } = t.context;
  await app.client.waitUntilWindowLoaded();

  const win = app.browserWindow;
  t.false(await win.isMinimized());
  t.true(await win.isVisible());
  t.false(await win.isDevToolsOpened());
  t.is(await app.client.getWindowCount(), 1);

  const { width, height } = await win.getBounds();
  t.true(width > 0);
  t.true(height > 0);
});
