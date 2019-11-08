import 'globals';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { routerMiddleware } from 'connected-react-router';
import { forwardToMain, replayActionRenderer } from 'electron-redux';
import { createHashHistory } from 'history';
import { ApolloProvider } from '@apollo/react-hooks';

import initialState from './App/App.state';
import saga from './sagas';
import reducer from './reducer';
import client from './apollo/client';
import configureStore from './shared/store';
import Routes from './routes';

const createSaga = () => function* rootSaga() { yield saga(); };
const history = createHashHistory();
const store = configureStore(reducer(history), initialState, middlewares => [
  forwardToMain,
  routerMiddleware(history),
  ...middlewares,
], createSaga());

replayActionRenderer(store);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Routes history={history} />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./reducer', () => {
    store.replaceReducer(require('./reducer').default); // eslint-disable-line global-require
  });
}
