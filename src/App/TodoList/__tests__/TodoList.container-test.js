import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { createMockClient } from 'mock-apollo-client';

import { updateWrapper } from 'Framework/EnzymeHelpers';

import TodoList from '../TodoList.container';
import query from '../TodoList.query.gql';


const mockStore = configureMockStore([]);

const completedTodo = {
  id: 0,
  text: 'Completed Item',
  completed: true,
};
const activeTodo = {
  id: 1,
  text: 'Active Item',
  completed: false,
};
const todos = { present: [completedTodo, activeTodo] };

describe('container <TodoList />', () => {
  it('TodoList should render without crashing', async () => {
    const store = mockStore({ todos });
    const client = createMockClient();
    client.setRequestHandler(query, () => Promise.resolve({ data: { todos: [] } }));
    const wrapper = mount(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <TodoList />
        </Provider>
      </ApolloProvider>,
    );
    await updateWrapper(wrapper);
  });
});
