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

      read(callback) {
        Todo.findAll()
        .then( data => {
          return callback(data);
        }
        )
      } // read

      // update

    }, //classMethods


    instanceMethods: {

    } // instanceMethods

  });
  return Todo;
};