import { DataSource } from 'apollo-datasource';
import Sequelize from 'sequelize-mock';

const getQuery = () => require('../TodoList.resolvers').Query; // eslint-disable-line global-require
const getMutation = () => require('../TodoList.resolvers').Mutation; // eslint-disable-line global-require

let Todo;
let config;

beforeEach(() => {
  jest.resetModules();
  const sequelize = new Sequelize();
  Todo = sequelize.define('Todo', {
    id: '1',
    text: 'Item',
    completed: true,
  });
  jest.doMock('persistence/sequelize', () => sequelize);
  jest.doMock('persistence/sequelize/models/todo', () => () => Todo);

  const { default: store } = require('../TodoList.store'); // eslint-disable-line global-require
  const Store = store(DataSource);
  config = {
    dataSources: {
      store: new Store(),
    },
  };
});

afterEach(() => {
  Todo.$queryInterface.$clearResults();
});

describe('TodoList query resolvers', () => {
  it('should get todos successfully', () => getQuery().getTodos(undefined, {}, config).then(todos => expect(todos.length).toBe(1)));
});

describe('TodoList mutation resolvers', () => {
  describe('should save todos', () => {
    it('successfully', () => getMutation().saveTodos(undefined, { todos: [{ id: 'temp_0', text: 'Item' }] }, config).then(({ success }) => expect(success).toBe(true)));
    it('unsuccessfully', () => {
      Todo.$queryInterface.$queueFailure('Fail');
      return getMutation().saveTodos(undefined, { todos: {} }, config)
        .then(({ success }) => expect(success).toBe(false));
    });
  });

  describe('should add todo', () => {
    it('successfully', () => getMutation().addTodo(undefined, { todo: { text: 'Item' } }, config).then(({ success }) => expect(success).toBe(true)));
    it('unsuccessfully', () => {
      Todo.Instance.prototype.save = async () => new Sequelize.Error('Fail');
      return getMutation().addTodo(undefined, { todo: {} }, config)
        .then(({ success }) => expect(success).toBe(false));
    });
  });

  describe('should delete todo', () => {
    it('successfully', () => getMutation().deleteTodo(undefined, { id: '1' }, config).then(({ success }) => expect(success).toBe(true)));
    it('unsuccessfully', () => {
      Todo.$queryInterface.$queueFailure('Fail');
      return getMutation().deleteTodo(undefined, { id: '1' }, config).then(({ success }) => expect(success).toBe(false));
    });
  });

  describe('should delete todos', () => {
    it('successfully', () => getMutation().deleteTodos(undefined, { ids: ['1'] }, config).then(({ success }) => expect(success).toBe(true)));
    it('unsuccessfully', () => {
      Todo.$queryInterface.$queueFailure('Fail');
      return getMutation().deleteTodos(undefined, { ids: ['1'] }, config).then(({ success }) => expect(success).toBe(false));
    });
  });

  describe('should update todo', () => {
    it('successfully', () => getMutation().updateTodo(undefined, { todo: { id: '1', text: 'Item', completed: false } }, config).then(({ success }) => expect(success).toBe(true)));
    it('unsuccessfully', () => {
      Todo.$queryInterface.$queueFailure('Fail');
      return getMutation().updateTodo(undefined, { todo: { id: '1', text: 'Item', completed: false } }, config).then(({ success }) => expect(success).toBe(false));
    });
  });
});
