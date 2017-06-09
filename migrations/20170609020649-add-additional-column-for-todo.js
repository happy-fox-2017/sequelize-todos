'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const migrations = [];
    migrations.push(queryInterface.addColumn(
      'Todos',
      'status',
      {
        type: Sequelize.INTEGER
      }
    ));
    migrations.push(queryInterface.addColumn(
      'Todos',
      'completedAt',
      {
        type: Sequelize.DATE
      }
    ));
    return Promise.all(migrations);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    const migrations = [];
    migrations.push(queryInterface.removeColumn(
      'Todos',
      'status'
    ));
    migrations.push(queryInterface.removeColumn(
      'Todos',
      'completedAt'
    ));
    return Promise.all(migrations);
    
  }
};
