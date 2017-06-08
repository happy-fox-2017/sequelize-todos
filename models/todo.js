'use strict';
module.exports = function(sequelize, DataTypes) {
  var Todo = sequelize.define('Todo', {
    task: DataTypes.STRING,
    tag: DataTypes.STRING,
    completed: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      getAllData(callback) {
        Todos.findAll()
        .then( data => {
          return callback(data);
        }
        )
      }
    }
  });
  return Todos;
};