import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';

const cache = new InMemoryCache();
const link = new HttpLink({ uri: 'http://localhost:4000/graphql' });
const filterMetaMiddleware = new ApolloLink((operation, forward) => {
  let { variables: { __typename, todos, ...variables } } = operation;
  if (todos) {
    __typename = true;
    todos = todos.map(({ __typename: _, ...todo }) => todo);
    variables = { ...variables, todos };
  }
  return forward(__typename ? Object.assign(operation, { variables }) : operation);
});

export default new ApolloClient({
  cache,
  link: concat(filterMetaMiddleware, link),
  connectToDevTools: true,
});
