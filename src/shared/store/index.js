import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

const composeEnhancers = composeWithDevTools({ trace: true });

function* noopSaga() {} // eslint-disable-line no-empty-function

export default function configureStore(reducer, initialState, middlewares, sagas = noopSaga) {
  const sagaMiddleware = createSagaMiddleware();
  const defaultMiddlewares = [sagaMiddleware];
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares(defaultMiddlewares))),
  );
  sagaMiddleware.run(sagas);
  return store;
}
