import { all } from 'redux-saga/effects';

import todoSaga from './TodoList/TodoList.sagas';

export default function* saga() {
  yield all([
    todoSaga(),
  ]);
}
