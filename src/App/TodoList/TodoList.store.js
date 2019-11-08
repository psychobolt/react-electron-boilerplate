import Sequelize, { Op } from 'sequelize';

import { sqlite } from 'persistence/sqlite';
import Model from 'persistence/sequelize/models/todo';

const Todo = Model(sqlite, Sequelize);

export default SubType => class extends SubType {
  getTodos = ids => Todo.findAll(ids ? { where: { id: { [Op.in]: ids } } } : {})

  saveTodos = todos => Todo.bulkCreate(todos, {
    updateOnDuplicate: ['text', 'completed'],
    returning: true,
  })

  addTodo = todo => Todo.build(todo).save()

  deleteTodo = id => Todo.destroy({ where: { id } })

  deleteTodos = ids => Todo.destroy({ where: { id: { [Op.in]: ids } } })

  updateTodo = ({ id, ...props }) => Todo
    .update(props, { where: { id: { [Op.eq]: id } }, individualHooks: true })
};
