import Sequelize from 'sequelize';
import Umzug from 'umzug';

import { sqlite } from './sqlite';

const getFile = path => {
  const paths = path.split('/');
  return paths[paths.length - 1];
};

const importAll = require => require.keys().map(path => {
  const { up, down } = require(path); // eslint-disable-line import/no-dynamic-require
  const queryInterface = sqlite.getQueryInterface();
  const file = getFile(path);
  return {
    path: null,
    file,
    up: () => up(queryInterface, Sequelize),
    down: () => down(queryInterface, Sequelize),
    testFileName: needle => needle === file,
  };
});

const migrations = importAll(require.context('./sequelize/migrations', true, /\.js/));

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sqlite,
  },
  migrations,
});

export default umzug;
