import sqlite3 from 'sqlite3';

import config from './sequelize/config';

sqlite3.verbose();

const { storage } = config[process.env.NODE_ENV];

export default () => new sqlite3.Database(storage);
