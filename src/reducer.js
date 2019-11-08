import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import appReducers from './App/App.reducers';
import splashReducers from './Splash/Splash.reducers';
import { frameworkReducers } from './Framework';

export default history => combineReducers({
  ...appReducers,
  ...splashReducers,
  ...frameworkReducers,
  router: connectRouter(history),
});
