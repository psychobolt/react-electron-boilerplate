import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';

import Splash from '../Splash.component';
import initialState from '../Splash.state';

const mockStore = configureMockStore([]);

test('component <Splash /> should render without crashing', () => {
  const store = mockStore(initialState);
  mount(<Provider store={store}><Splash /></Provider>);
});
