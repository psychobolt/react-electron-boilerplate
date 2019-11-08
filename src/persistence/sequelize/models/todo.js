module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    text: DataTypes.STRING,
    completed: DataTypes.BOOLEAN,
  }, {});
  // Todo.associate = models => {
  //   // associations can be defined here
  // };
  return Todo;
};
