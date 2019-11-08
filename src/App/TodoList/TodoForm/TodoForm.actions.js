import { createActions } from 'redux-actions';

let nextTodoId = 0;

export const Actions = {
  ADD_TODO: 'addTodo',
};

export const { addTodo } = createActions({
  [Actions.ADD_TODO]: text => ({
    id: `temp_${nextTodoId++}`, // eslint-disable-line no-plusplus
    text,
  }),
});
