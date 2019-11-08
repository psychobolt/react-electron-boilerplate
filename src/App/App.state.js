import todoListInitialstate from './TodoList/TodoList.state';

export default {
  ...todoListInitialstate,
  app: {
    webUndoRedoEnabled: false,
  },
};
