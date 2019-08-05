import { connect } from 'react-redux';

import TodoItem from './TodoItem.component';
import { toggleTodo, deleteTodo } from './TodoItem.actions';

const mapDispatchToProps = (dispatch, { id }) => ({
  onToggle: () => {
    dispatch(toggleTodo(id));
  },
  onDelete: () => {
    dispatch(deleteTodo(id));
  },
});

export default connect(undefined, mapDispatchToProps)(TodoItem);
