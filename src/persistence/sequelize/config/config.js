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
      return process.env.APPDATA;
    default:
      throw new Error(`Electron builds are not available on platform: ${platform}`);
  }
};

const defaultOptions = {
  dialect: 'sqlite',
  dialectModule: sqlite3,
};

const rootPath = path.resolve('.');

module.exports = {
  development: {
    ...defaultOptions,
    storage: path.resolve(rootPath, 'dev.db'),
  },
  test: {
    ...defaultOptions,
    storage: path.resolve(rootPath, 'test.db'),
  },
  production: {
    ...defaultOptions,
    storage: path.resolve(getUserDataDir(), 'store.db'),
  },
};
