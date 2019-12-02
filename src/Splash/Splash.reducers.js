import { handleActions } from 'redux-actions';
import initialState from './Splash.state';

import { updateLoadingText } from './Splash.actions';

export default {
  splash: handleActions({
    [updateLoadingText]: (state, { payload }) => ({ ...state, loadingText: payload }),
  }, initialState.splash),
};
