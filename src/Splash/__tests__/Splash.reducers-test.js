import configureMockStore from 'redux-mock-store';

import reducers from '../Splash.reducers';
import { updateLoadingText } from '../Splash.actions';

const mockStore = configureMockStore();

test('Splash reducer should update loading text', () => {
  const loadingText = 'Testing...';
  const store = mockStore(([action]) => reducers.splash(undefined, action));
  store.dispatch(updateLoadingText(loadingText));
  expect(store.getState()).toEqual({ loadingText });
});
