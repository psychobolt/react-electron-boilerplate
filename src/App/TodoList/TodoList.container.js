import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';

import TodoList from './TodoList.component';
import { getVisibleTodos } from './TodoList.selectors';
import { loadTodos } from './TodoList.actions';
import query from './TodoList.query.gql';

export default props => {
  const dispatch = useDispatch();
  const { loading } = useQuery(query, { onCompleted: ({ todos }) => dispatch(loadTodos(todos)) });
  const todos = useSelector(state => getVisibleTodos(state, props));
  return <TodoList defaultText={loading ? 'Loading' : 'No items'} todos={todos} {...props} />;
};
