import { app, BrowserWindow, Menu } from 'electron';
import { forwardToRenderer, replayActionMain } from 'electron-redux';
import Store from 'electron-store';
import log from 'electron-log';
import { combineReducers } from 'redux';
import path from 'path';
import url from 'url';

import initialState from './App/TodoList/TodoList.state';
import reducers from './App/TodoList/TodoList.reducers';
import configureStore from './shared/store';
import menu from './menu';

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
  const lockfile = require('../devtools.json'); // eslint-disable-line global-require
  const installed = BrowserWindow.getDevToolsExtensions();
  const { default: install, ...configs } = require('electron-devtools-installer'); // eslint-disable-line global-require
  return Promise.all(Object.entries(configs)
    .reduce((list, [extension, config]) => {
      const { name, version } = lockfile[extension] || {};
      const current = installed[name];
      if (name) {
        return [...list, install(config.id, current.version !== version)];
      }
      if (current) {
        BrowserWindow.removeDevToolsExtension(name);
      }
      return list;
    }, []));
}

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: electronStore.get('window.size.width', 800),
    height: electronStore.get('window.size.height', 600),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'production') {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    }));
  } else {
    await installExtension();
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
    win.loadURL('http://localhost:3000/'); // TODO: pass port
  }

  if (process.env.NODE_ENV === 'development') {
    // Open the DevTools.
    win.webContents.openDevTools();
  }

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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
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
