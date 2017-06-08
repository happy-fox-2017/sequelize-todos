'use strict';
module.exports = function(sequelize, DataTypes) {
  var todolist = sequelize.define('todolist', {
    task: DataTypes.STRING,
    date_complete: DataTypes.DATEONLY,
    complete: DataTypes.STRING,
    tag : DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return todolist;
};
