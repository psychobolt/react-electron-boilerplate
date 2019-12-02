import { DataSource } from 'apollo-datasource';

import { Query } from '../App.resolvers';
import store from '../App.store';

jest.mock('persistence/sequelize', () => {
  const Sequelize = require('sequelize-mock'); // eslint-disable-line global-require
  return new Sequelize();
});

test('App resolvers should get store info', () => {
  const Store = store(DataSource);
  const config = {
    dataSources: {
      store: new Store(),
    },
  };
  Query.getStoreInfo(undefined, {}, config).then(infos => {
    expect(infos.findIndex(({ name }) => name === 'TodoList')).toBeGreaterThan(-1);
  });
});
