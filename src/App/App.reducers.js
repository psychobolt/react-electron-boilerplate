import { handleActions } from 'redux-actions';

import initialState from './App.state';
import { loadTodos, saveTodos } from './TodoList/TodoList.actions';
import todoListReducers from './TodoList/TodoList.reducers';

export default {
  ...todoListReducers,
  app: handleActions({
    [loadTodos]: state => ({ ...state, saving: false }),
    [saveTodos]: state => ({ ...state, saving: true }),
  }, initialState.app),
};
