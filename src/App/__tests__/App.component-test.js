import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { createMockClient } from 'mock-apollo-client';

import { updateWrapper } from 'Framework/EnzymeHelpers';

import App from '../App.component';
import initialState from '../App.state';

const mockStore = configureMockStore([]);

describe('component <App />', () => {
  it('should render without crashing', async () => {
    const store = mockStore(initialState);
    const client = createMockClient();
    const props = {
      match: {
        params: {},
      },
    };
    const wrapper = mount(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <MemoryRouter>
            <App {...props} />
          </MemoryRouter>
        </Provider>
      </ApolloProvider>,
    );
    await updateWrapper(wrapper);
    wrapper.unmount();
  });
});
