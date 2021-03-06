import log from 'electron-log';

export const Query = {
  getTodos: (_, { ids }, { dataSources }) => dataSources.store.getTodos(ids)
    .then(collection => collection.map(model => model.toJSON())),
};

export const Mutation = {
  saveTodos: (_, { todos }, { dataSources }) => dataSources.store.saveTodos(todos)
    .then(collection => ({
      code: 200,
      success: true,
      message: 'The todo items have been saved',
      todos: collection.map(model => model.toJSON()),
    }))
    .catch(error => {
      log.error('Failed to save todo items in database');
      log.debug(error);
      return {
        code: 500,
        success: false,
        message: 'Todo items were not saved. Please check application logs for details.',
      };
    }),
  addTodo: (_, { todo }, { dataSources }) => dataSources.store.addTodo(todo)
    .then(model => ({
      code: 200,
      success: true,
      message: 'The todo item has been added',
      todo: model.toJSON(),
    }))
    .catch(error => {
      log.error('Failed to create todo item in database');
      log.debug(error);
      return {
        code: 500,
        success: false,
        message: 'The todo item was not added. Please check application logs for details.',
      };
    }),
  deleteTodo: (_, { id }, { dataSources }) => dataSources.store.deleteTodo(id)
    .then(() => ({
      code: 200,
      success: true,
      message: 'The todo item has been deleted',
    }))
    .catch(error => {
      log.error('Failed to delete todo item in database');
      log.debug(error);
      return {
        code: 500,
        success: false,
        message: 'The todo item was not deleted. Please check application logs for details.',
      };
    }),
  deleteTodos: (_, { ids }, { dataSources }) => dataSources.store.deleteTodos(ids)
    .then(() => ({
      code: 200,
      success: true,
      message: 'The todo items were deleted',
    }))
    .catch(error => {
      log.error('Failed to delete todo items in database');
      log.error(error);
      return {
        code: 500,
        success: false,
        message: 'Todo items were not deleted. Please check application logs for details.',
      };
    }),
  updateTodo: (_, { todo }, { dataSources }) => dataSources.store.updateTodo(todo)
    .then(() => ({
      code: 200,
      success: true,
      message: 'The todo item was updated',
    }))
    .catch(error => {
      log.error('Failed to update todo item in database');
      log.debug(error);
      return {
        code: 500,
        success: false,
        message: 'The todo item was not updated. Please check application logs for details.',
      };
    }),
};
