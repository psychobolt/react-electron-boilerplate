import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import { Filters } from '../TodoList';
import App from '../App.component';
import initialState from '../App.state';

const mockStore = configureMockStore([]);

describe('component <App />', () => {
  [Filters.ALL, undefined].forEach(filter => {
    it(` should render without crashing with filter ${filter}`, () => {
      const store = mockStore(initialState);
      const props = {
        match: {
          params: { filter },
        },
      };
      shallow(
        <Provider store={store}>
          <App {...props} />
        </Provider>,
      );
    });
  });
});
