import { app, BrowserWindow, Menu } from 'electron';
import { forwardToRenderer, replayActionMain } from 'electron-redux';
import Store from 'electron-store';
import log from 'electron-log';
import { combineReducers } from 'redux';
import path from 'path';
import url from 'url';
import wait from 'waait';

import initialState from './state';
import { updateLoadingText } from './Splash/Splash.actions';
import reducers from './App/App.reducers';
import configureStore from './shared/store';
import { up } from './persistence';
import menu from './menu';

app.commandLine.appendSwitch('ignore-gpu-blacklist');

log.catchErrors();

const electronStore = new Store();

const store = configureStore(
  combineReducers(reducers),
  initialState,
  middlewares => [...middlewares, forwardToRenderer],
);

replayActionMain(store);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

async function installExtension() {
  const devtools = require('../devtools.json'); // eslint-disable-line global-require
  const installed = BrowserWindow.getDevToolsExtensions();
  const { default: install } = require('electron-devtools-installer'); // eslint-disable-line global-require
  const extensions = Object.entries(devtools)
    .reduce((list, [name, { id, version }]) => {
      const current = installed[name];
      return [...list, [id, !current || current.version !== version]];
    }, []);
  Object.values(installed)
    .forEach(({ name }) => !devtools[name] && BrowserWindow.removeDevToolsExtension(name));
  return Promise.all(extensions.map(extension => install(...extension)));
}

let waitOnStart = !process.env.SKIP_SPLASH;

async function createSplash(parent) {
  if (!waitOnStart) return null;

  const splash = new BrowserWindow({
    width: 500,
    height: 300,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    frame: false,
    show: false,
    parent,
    autoHideMenuBar: true,
    type: 'splash',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === 'production') {
    splash.loadURL(url.format({
      pathname: path.join(__dirname, 'splash.html'),
      protocol: 'file:',
      slashes: true,
    }));
  } else {
    splash.loadURL('http://localhost:3000/splash.html');
  }

  splash.on('closed', () => {
    waitOnStart = false;
  });

  splash.on('ready-to-show', () => splash.show());

  await wait(2750);

  return splash;
}

let stopServer;

async function createWindow() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    label: app.name,
    submenu: [{ role: 'quit' }],
  }]));

  if (process.env.NODE_ENV === 'production') {
    const { default: startServer } = require('./server'); // eslint-disable-line global-require
    stopServer = await startServer(); // start all connections
  }

  // Create the browser window.
  win = new BrowserWindow({
    width: electronStore.get('window.size.width', 800),
    height: electronStore.get('window.size.height', 600),
    show: !waitOnStart,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const splash = await createSplash(win);

  store.dispatch(updateLoadingText('Preparing data...'));
  await up();

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'production') {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    }));
  } else {
    store.dispatch(updateLoadingText('Installing extensions...'));
    await installExtension();
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
    win.loadURL('http://localhost:3000/');
  }

  win.once('show', () => {
    if (process.env.NODE_ENV === 'development') {
      // Open the DevTools.
      win.webContents.openDevTools();
    }
  });

  win.on('resize', () => {
    const [width, height] = win.getSize();
    electronStore.set({
      window: {
        size: {
          width,
          height,
        },
      },
    });
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  Menu.setApplicationMenu(menu(win, store));

  if (splash) {
    splash.close();
    win.show();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', async () => {
  if (process.NODE_ENV === 'production') {
    await stopServer(); // destroy all connections
  }

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
