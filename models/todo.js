'use strict';
module.exports = function(sequelize, DataTypes) {
  var Todo = sequelize.define('Todo', {
    task: DataTypes.STRING,
    status: DataTypes.INTEGER,
    completedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Todo.hasMany(models.Tag, {foreignKey: 'todo_id'});
      }
    },
    instanceMethods: {
      getCompleted: function() {
        return this.status === 1;
      },
      complete: function() {
        this.status = 1;
        this.save();
      },
      uncomplete: function() {
        this.status = 0;
        this.save();
      }
    }
  });
  return Todo;
};
