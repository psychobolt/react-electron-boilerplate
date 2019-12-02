import { Query as TodoListQuery, Mutation as TodoListMutation } from './TodoList/TodoList.resolvers';

export const Query = {
  ...TodoListQuery,
  getStoreInfo: async (_, variables, { dataSources }) => dataSources.store.getStoreInfo(),
};

export const Mutation = {
  ...TodoListMutation,
};
