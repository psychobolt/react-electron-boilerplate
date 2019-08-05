import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import TodoItem from '../TodoItem.container';
import { toggleTodo, deleteTodo } from '../TodoItem.actions';

const mockStore = configureMockStore([]);

const todo = {
  id: 0,
};
const todos = { present: [todo] };

describe('container <TodoItem />', () => {
  it('TodoItem should dispatch action on checkbox', () => {
    const store = mockStore({ todos });
    const wrapper = mount(<Provider store={store}><TodoItem {...todo} /></Provider>);
    wrapper.find('x-checkbox').simulate('click');
    expect(store.getActions()).toEqual([toggleTodo(todo.id)]);
  });

  it('TodoItem should dispatch action on clicking delete', () => {
    const store = mockStore({ todos });
    const wrapper = mount(<Provider store={store}><TodoItem {...todo} /></Provider>);
    wrapper.find('x-icon[name="delete"]').simulate('click');
    expect(store.getActions()).toEqual([deleteTodo(todo.id)]);
  });
});
