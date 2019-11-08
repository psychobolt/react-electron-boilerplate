import React from 'react';
import { useDispatch } from 'react-redux';

import TodoForm from './TodoForm.component';
import { addTodo } from './TodoForm.actions';

export default props => {
  const dispatch = useDispatch();
  return <TodoForm onValueSubmit={value => value.trim() && dispatch(addTodo(value))} {...props} />;
};
