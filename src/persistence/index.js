import SQLite from './sqlite';

export default () => {
  const sqlite = SQLite();
  return () => {
    sqlite.close();
  };
};
