import { select, put, takeEvery } from 'redux-saga/effects';

import client from 'apollo/client';
import { getTodos } from './TodoList.selectors';
import { Actions, loadTodos, fetchTodos } from './TodoList.actions';
import query from './TodoList.query.gql';
import { UpsertTodos, DeleteTodos } from './TodoList.mutation.gql';

function* queryTodos(network) {
  const response = yield client.query({
    query,
    fetchPolicy: network ? 'network-only' : 'cache-first',
  });
  return response.data.todos;
}

function* onFetchTodos({ payload: { network } = {} }) {
  yield put(loadTodos(yield queryTodos(network)));
}

function* onSaveTodos() {
  const current = yield select(getTodos);
  const deleted = (yield queryTodos())
    .reduce((ids, { id }) => (!current.find(item => item.id === id) ? [...ids, id] : ids), []);
  if (deleted.length) {
    yield client.mutate({
      mutation: DeleteTodos,
      variables: { ids: deleted },
    });
  }
  const { data } = yield client.mutate({
    mutation: UpsertTodos,
    variables: { todos: current.map(({ id, ...todo }) => (id.indexOf('temp_') > -1 ? todo : { id, ...todo })) },
  });
  const { todos: updated } = data.saveTodos;
  yield put(fetchTodos({ network: (deleted.length || updated.length) > 0 }));
}

export default function* saga() {
  yield takeEvery(Actions.FETCH_TODOS, onFetchTodos);
  yield takeEvery(Actions.SAVE_TODOS, onSaveTodos);
}
