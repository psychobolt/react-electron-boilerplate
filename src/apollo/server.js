import { ApolloServer, gql } from 'apollo-server-express';
import { DataSource } from 'apollo-datasource';

import schema from 'App/App.schema.gql';
import * as resolvers from 'App/App.resolvers';
import appStore from 'App/App.store';

export default app => {
  const AppStore = appStore(DataSource);
  const apollo = new ApolloServer({
    typeDefs: gql(schema),
    resolvers,
    dataSources: () => ({
      store: new AppStore(),
    }),
  });
  apollo.applyMiddleware({ app });
};
