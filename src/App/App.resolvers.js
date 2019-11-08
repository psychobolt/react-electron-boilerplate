import { Query as TodoListQuery, Mutation as TodoListMutation } from './TodoList/TodoList.resolvers';

export const Query = {
  // info: () => ({
  //   about: 'A simple application to maintain your own todo list.',
  // }),
  ...TodoListQuery,
};

export const Mutation = {
  ...TodoListMutation,
};
