import { handleActions } from 'redux-actions';
import undoable, { excludeAction } from 'redux-undo';

import { Actions, loadTodos } from './TodoList.actions';
import initialState from './TodoList.state';
import { addTodo } from './TodoForm/TodoForm.actions';
import { deleteTodo, toggleTodo } from './TodoItem';

export const todosReducer = handleActions({
  [loadTodos]: (state, { payload }) => payload,
  [addTodo]: (state, { payload: { id, text } }) => [...state, { id, text, completed: false }],
  [deleteTodo]: (state, { payload: { id } }) => state.filter(todo => todo.id !== id),
  [toggleTodo]: (state, { payload: { id } }) => state
    .map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
}, initialState.todos.present);

export default {
  todos: undoable(todosReducer, {
    undoType: Actions.UNDO_TODO,
    redoType: Actions.REDO_TODO,
    filter: excludeAction([Actions.LOAD_TODOS, Actions.FETCH_TODOS, Actions.SAVE_TODOS]),
    syncFilter: true,
  }),
};
