import React from 'react';
import { act } from 'react-dom/test-utils';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import wait from 'waait';
import configureMockStore from 'redux-mock-store';
import { createMockClient } from 'mock-apollo-client';

import TodoList from '../TodoList.container';
import query from '../TodoList.query.gql';

export async function updateWrapper(wrapper, amount = 0) {
  await act(async () => {
    await wait(amount);
    wrapper.update();
  });
}

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
  it('TodoList should render without crashing', async done => {
    const store = mockStore({ todos });
    const client = createMockClient();
    client.setRequestHandler(query, () => Promise.resolve({ data: { todos: [] } }));
    store.subscribe(() => {
      done();
    });
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
