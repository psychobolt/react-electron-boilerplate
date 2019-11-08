import { createActions } from 'redux-actions';

export const Actions = {
  LOAD_TODOS: 'loadTodos',
  FETCH_TODOS: 'fetchTodos',
  SAVE_TODOS: 'saveTodos',
  UNDO_TODO: 'undoTodo',
  REDO_TODO: 'redoTodo',
};

export const {
  loadTodos,
  fetchTodos,
  saveTodos,
  undoTodo,
  redoTodo,
} = createActions(
  Actions.LOAD_TODOS,
  Actions.FETCH_TODOS,
  Actions.SAVE_TODOS,
  Actions.UNDO_TODO,
  Actions.REDO_TODO,
);
