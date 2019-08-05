export const Actions = {
  UNDO_TODO: 'undoTodo',
  REDO_TODO: 'redoTodo',
};

export const undoTodo = () => ({ type: Actions.UNDO_TODO });
export const redoTodo = () => ({ type: Actions.REDO_TODO });
