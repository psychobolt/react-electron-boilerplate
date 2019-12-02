import configureStore from 'redux-mock-store';

import reducers from '../App.reducers';
import { loadTodos, saveTodos } from '../TodoList/TodoList.actions';

const mockStore = configureStore([]);

describe('App reducer', () => {
  it('should disable saving status on loading todos', () => {
    const store = mockStore(([action]) => reducers.app(undefined, action));
    store.dispatch(loadTodos([]));
    expect(store.getState()).toEqual({ saving: false });
  });

  it('should enable saving status on saving todos', () => {
    const store = mockStore(([action]) => reducers.app(undefined, action));
    store.dispatch(saveTodos([]));
    expect(store.getState()).toEqual({ saving: true });
  });
});
