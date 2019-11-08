import sqlite3 from 'sqlite3';
import Sequelize from 'sequelize';

import config from './sequelize/config';

sqlite3.verbose();

const { storage } = config[process.env.NODE_ENV];

export const sqlite = new Sequelize({
  dialect: 'sqlite',
  dialectModule: sqlite3,
  storage,
});

export default () => new sqlite3.Database(storage);
