import 'splash.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { forwardToMain, replayActionRenderer } from 'electron-redux';
import { createHashHistory } from 'history';

import Splash from './Splash/Splash.component'; // eslint-disable-line import/no-unresolved
import reducer from './reducer';
import initialState from './Splash/Splash.state';
import configureStore from './shared/store';

const history = createHashHistory();
const store = configureStore(
  reducer(history), initialState, middlewares => [
    forwardToMain,
    ...middlewares,
  ],
);

replayActionRenderer(store);

ReactDOM.render(
  <Provider store={store}><Splash /></Provider>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
