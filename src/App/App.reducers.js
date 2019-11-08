import { handleActions } from 'redux-actions';

import { toggleWebUndoRedo } from './App.actions';
import initialState from './App.state';
import { loadTodos, saveTodos } from './TodoList/TodoList.actions';
import todoListReducers from './TodoList/TodoList.reducers';

export default {
  ...todoListReducers,
  app: handleActions({
    [toggleWebUndoRedo]: (state, { payload: { value } }) => ({
      ...state,
      webUndoRedoEnabled: value,
    }),
    [loadTodos]: state => ({ ...state, saving: false }),
    [saveTodos]: state => ({ ...state, saving: true }),
  }, initialState.app),
};
