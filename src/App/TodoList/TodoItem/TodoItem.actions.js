import { createActions } from 'redux-actions';

export const Actions = {
  TOGGLE_TODO: 'toggleTodo',
  DELETE_TODO: 'deleteTodo',
};

export const { toggleTodo, deleteTodo } = createActions({
  [Actions.TOGGLE_TODO]: id => ({ id }),
  [Actions.DELETE_TODO]: id => ({ id }),
});
