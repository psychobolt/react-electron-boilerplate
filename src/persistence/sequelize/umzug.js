import Sequelize from 'sequelize';
import Umzug from 'umzug';

import sequelize from './index';

const getFile = path => {
  const paths = path.split('/');
  return paths[paths.length - 1];
};

const importAll = require => require.keys().map(path => {
  const { up, down } = require(path); // eslint-disable-line import/no-dynamic-require
  const queryInterface = sequelize.getQueryInterface();
  const file = getFile(path);
  return {
    path: null,
    file,
    up: () => up(queryInterface, Sequelize),
    down: () => down(queryInterface, Sequelize),
    testFileName: needle => needle === file,
  };
});


let migrations;
try {
  migrations = require.context('./migrations', true, /\.js/);
} catch (e) {
  migrations = [];
}

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize,
  },
  migrations: importAll(migrations),
});

export default umzug;
