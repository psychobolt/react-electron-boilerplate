export const Actions = {
  TOGGLE_TODO: 'toggleTodo',
  DELETE_TODO: 'deleteTodo',
};

export const toggleTodo = id => ({
  type: Actions.TOGGLE_TODO,
  payload: { id },
});

export const deleteTodo = id => ({
  type: Actions.DELETE_TODO,
  payload: { id },
});
