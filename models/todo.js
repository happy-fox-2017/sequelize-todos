'use strict';
module.exports = function(sequelize, DataTypes) {
  var Todo = sequelize.define('Todo', {
    task: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Todo.hasMany(models.Tag, {foreignKey: 'todo_id'});
      }
    }
  });
  return Todo;
};
