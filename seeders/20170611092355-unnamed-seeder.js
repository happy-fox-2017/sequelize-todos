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
        task: 'Eat',
        completed: 0,
        tag : 'makan',
        createdAt: new Date(),
        updatedAt: new Date()
     },
     {
       task: 'Coding',
       completed: 0,
       tag : 'ngoding',
       createdAt: new Date(),
       updatedAt: new Date()
     },
     {
       task: 'Sleep',
       completed: 0,
       tag : 'tidur',
       createdAt: new Date(),
       updatedAt: new Date()
     }
   ]);
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
