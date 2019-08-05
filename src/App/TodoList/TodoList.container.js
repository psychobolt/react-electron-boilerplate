// @flow
import { connect } from 'react-redux';

import TodoList from './TodoList.component';
import { getVisibleTodos } from './TodoList.selectors';
import type { TodoListState } from './TodoList.state';

type Props = {
  filter: string
};

export const mapStateToProps = (state: TodoListState, props: Props) => ({
  todos: getVisibleTodos(state, props),
});

export default connect(mapStateToProps)(TodoList);
