import { expectSaga } from 'redux-saga-test-plan';

import { database } from 'apollo/client'; // eslint-disable-line import/named

import { fetchTodos, loadTodos, saveTodos } from '../TodoList.actions';

jest.mock('apollo/client');

const getSaga = () => require('../TodoList.sagas').default; // eslint-disable-line global-require

describe('TodoList sagas', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe('should load todos on fetch', () => {
    it('cache-first', () => expectSaga(getSaga())
      .put(loadTodos(database.getTodos()))
      .dispatch(fetchTodos())
      .silentRun());

    it('network-only', () => expectSaga(getSaga())
      .put(loadTodos(database.getTodos()))
      .dispatch(fetchTodos({ network: true }))
      .silentRun());
  });

  describe('should fetch todos on saving', () => {
    it('for existing todos', () => {
      const store = [
        {
          ...database.getTodo(0),
          completed: true,
        },
      ];
      const saga = expectSaga(getSaga())
        .withState({ todos: { present: store } })
        .put(fetchTodos({ network: true }))
        .dispatch(saveTodos(store));
      return saga.silentRun().then(() => {
        saga.put(loadTodos(database.getTodos()));
      });
    });

    it('for new todos', () => {
      const newItem = {
        id: 'temp_0',
        text: 'Item 3',
        completed: false,
      };
      const store = [
        ...database.getTodos(),
        newItem,
      ];
      const saga = expectSaga(getSaga())
        .withState({ todos: { present: store } })
        .put(fetchTodos({ network: true }))
        .dispatch(saveTodos(store));
      return saga.silentRun().then(() => {
        saga.put(loadTodos(database.getTodos()));
      });
    });
  });
});
