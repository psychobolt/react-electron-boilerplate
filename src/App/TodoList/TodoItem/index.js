// @flow
export type Todo = {
  id: number,
  completed?: boolean,
  text: string
};

export * from './TodoItem.actions';
export { default } from './TodoItem.container';
