'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('Todos', [
      {
      task: 'mango tree',
      tag: 'anchor',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date()
      },
      {
      task: 'number to word',
      tag: 'rocket',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
      }
  ], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};

// {task: 'bogle-2', tag: 'rocket', completed: false, createdAt: new Date(), updatedAt: new Date()}