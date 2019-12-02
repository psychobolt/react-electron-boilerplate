import { createMockClient } from 'mock-apollo-client';

import query from 'App/TodoList/TodoList.query.gql';
import { UpsertTodos, DeleteTodos } from 'App/TodoList/TodoList.mutation.gql';

const data = {
  todos: {
    0: {
      id: '0',
      text: 'Item 1',
      completed: false,
    },
    1: {
      id: '2',
      text: 'Item 2',
      completed: true,
    },
  },
};

class Database {
  todos = {};

  constructor() {
    this.todos = { ...data.todos };
  }

  getTodo(id) {
    return this.todos[id];
  }

  upsertTodo(todo) {
    this.todos[todo.id] = todo;
  }

  deleteTodo(id) {
    delete this.todos[id];
  }

  getTodos() {
    return Object.values(this.todos).map(todo => ({ ...todo }));
  }
}

export const database = new Database(data);

let nextTodoId = 2;

const client = createMockClient();

client.setRequestHandler(query, async () => ({ data: { todos: database.getTodos() } }));

client.setRequestHandler(UpsertTodos, async ({ todos }) => {
  todos.forEach(update => {
    const id = update.id || `${nextTodoId++}`; // eslint-disable-line no-plusplus
    database.upsertTodo({ ...update, id });
  });
  return {
    data: {
      saveTodos: {
        code: 200,
        success: true,
        message: 'Success',
        todos: database.getTodos(),
      },
    },
  };
});

client.setRequestHandler(DeleteTodos, async ({ ids }) => {
  ids.forEach(id => {
    database.deleteTodo(id);
  });
  return {
    data: {
      deleteTodos: {
        code: 200,
        success: true,
        message: 'Success',
      },
    },
  };
});

export default client;
