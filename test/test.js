const assert = require('assert');
const models = require('../models');

const Todo = models.Todo;

describe('Todo', function() {

  describe('#create()', function() {
    before(function (done) {
      Todo.destroy({ where: {} }).then(() => done());
    });

    it('should create todo without error', function (done) {
      Todo.create({
        task: 'Walk the dog'
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
  });

  describe('#findAll()', function() {
    before(function (done) {
      Todo.destroy({ where: {} })
      .then(() => {
        return Todo.create({
          task: 'Walk the dog'
        });
      })
      .then(() => done());
    });

    it('should list all todos', function (done) {
      Todo.findAll({
        task: 'Walk the dog'
      })
      .then((rows) => {
        assert.equal(1, rows.length);
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
  });

  describe('#update()', function() {
    before(function (done) {
      Todo.destroy({ where: {} })
      .then(() => {
        return Todo.create({
          task: 'Walk the dog'
        });
      })
      .then(() => done());
    });

    it('should update todo', function (done) {
      Todo.findOne({
        where: {task: 'Walk the dog'}
      })
      .then((row) => {
        row.task = 'javascript';
        return row.save()

      })
      .then (() => {
        return Todo.findOne({
          where: {task: 'javascript'}
        })
      })
      .then((row) => {
        assert.equal('javascript', row.task);
        done();

      })
      .catch((err) => {
        done(err);
      });
    });
  });

  describe('#delete()', function() {
    before(function (done) {
      Todo.destroy({ where: {} })
      .then(() => {
        return Todo.create({
          task: 'Walk the dog'
        });
      })
      .then(() => done());
    });

    it('should update todo', function (done) {
      Todo.destroy({ where: {} })
      .then (() => {
        return Todo.findOne({
          where: {task: 'javascript'}
        })
      })
      .then((row) => {
        assert.equal(null, row);
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
  });

});
