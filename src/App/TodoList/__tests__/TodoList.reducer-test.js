import { addTodo } from '../TodoForm';
import { toggleTodo, deleteTodo } from '../TodoItem';
import { todosReducer } from '../TodoList.reducers';
import initialState from '../TodoList.state';

describe('Todos reducer', () => {
  it('should return default state', () => {
    expect(todosReducer(undefined, { type: undefined })).toEqual(initialState.todos.present);
  });

  it('should add todo', () => {
    const action = addTodo('Item');
    expect(todosReducer(undefined, action)).toEqual([{
      ...action.payload,
      completed: false,
    }]);
  });

  it('should toggle todo', () => {
    const id = 0;
    const action = toggleTodo(id);
    const activeItem = {
      id,
      text: 'Item 1',
      completed: false,
    };
    const completedItem = {
      id: 1,
      text: 'Item 2',
      completed: true,
    };
    expect(todosReducer([activeItem, completedItem], action)).toEqual([{
      ...activeItem,
      completed: !activeItem.completed,
    }, completedItem]);
  });

  it('should delete todo', () => {
    const id = 0;
    const action = deleteTodo(id);
    const item = {
      id,
    };
    expect(todosReducer([item], action)).toEqual([]);
  });
});
