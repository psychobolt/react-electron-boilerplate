const os = require('os');
const path = require('path');
const sqlite3 = require('sqlite3');
const packageInfo = require('App/../package.json');

const { productName } = packageInfo;

const getUserDataDir = () => {
  const { platform } = process;
  switch (platform) {
    case 'darwin':
      return `${os.homedir()}/Library/Application Support/${productName}`;
    case 'freebsd':
    case 'linux':
      return `${os.homedir()}/.config/${productName}`;
    case 'win32':
      return `${process.env.APPDATA}/${productName}`;
    default:
      throw new Error(`Electron builds are not available on platform: ${platform}`);
  }
};

const defaultOptions = {
  dialect: 'sqlite',
  dialectModule: sqlite3,
};
const defaultStorage = process.env.DB_STORAGE;
const rootPath = path.resolve('.');

module.exports = {
  development: {
    ...defaultOptions,
    storage: defaultStorage || path.resolve(rootPath, 'dev.db'),
  },
  test: { // not being used at the moment
    ...defaultOptions,
    storage: defaultStorage || path.resolve(rootPath, 'test.db'),
  },
  production: {
    ...defaultOptions,
    storage: defaultStorage || path.resolve(getUserDataDir(), 'store.db'),
  },
};
