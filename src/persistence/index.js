import SQLite from './sqlite';
import sequelizeUmzug from './sequelize/umzug';

export const up = () => Promise.all([
  sequelizeUmzug.up(),
]);

export default () => {
  const sqlite = SQLite();
  return () => {
    sqlite.close();
  };
};
