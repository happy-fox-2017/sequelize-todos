"use strict"

const db = require ('./models'); //require models

class Model {

  createTask(task){
    db.Todo.create({
      task: task,
      completed: false,
      tags: null,
      createAt : new Date(),
      updatedAt : new Date()
    })
    .then(Todo => {
      console.log(`${task} berhasil ditambahkan!`);
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  removeTask(taskID){
    db.Todo.destroy({
      where: {
        id: taskID
      }
    }).then(() => {
      console.log('Task successfully removed!');
    })
    .catch((err) => {
      console.log(err);
    })
  }

  getList(){
    db.Todo.findAll()
    .then(list => {
      list.forEach(todo => {
        if(todo.completed === true) {
          console.log(`${todo.id}. ✔︎ ${todo.task}`);
        } else {
          console.log(`${todo.id}. ◎ ${todo.task}`);
        }
      })
    })
  }

  markComplete(id){
    db.Todo.update({
      completed: true
    }, {
      where: {
        id: id
      }
    })
    .then( () => {
      console.log(`update task ${id} success`);
    })
  }

  markUncomplete(id){
    db.Todo.update({
      completed: false
    }, {
      where: {
        id: id
      }
    })
    .then( () => {
      console.log(`update task ${id} uncompleted`);
    })
  }

  uncompletedList(){
    db.Todo
    .findAll({
      where: {
        completed: false
      },
      order:'"createdAt" ASC'
    })
    .then(Todo => {
      Todo.forEach(Todo => {
        console.log(`${Todo.id}. ◎ ${Todo.task}`);
      })
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  completedList(){
    db.Todo
    .findAll({
      where: {
        completed: true
      },
      order:'"createdAt" ASC'
    })
    .then(Todo => {
      Todo.forEach(Todo => {
        console.log(`${Todo.id}. ✔︎ ${Todo.task}`);
      })
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  createTag(id, tag) {
    db.Todo
    .update({
      tags: tag
    }, {
      where: {
        id: id
      }
    })
    .then( () => {
      console.log(`Your task has been tagged`);
    })
  }

  getListByTag(tag){
    db.Todo
    .findAll({
      where: {
        tags: tag
      },
      order:'"createdAt" ASC'
    })
    .then(Todo => {
      Todo.forEach(Todo => {
        console.log(`${Todo.id}. ◎ ${Todo.task} [Tag: ${Todo.tags}]`);
      })
    })
    .catch( (err) => {
      console.log(err);
    })
  }

}//class model

class View{
  displayTask() {

  }

  helpMenu(){
    console.log("⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾");
    console.log("====================== H E L P   M E N U =========================");
    console.log("⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾⌾");
    console.log("Option : ");
    console.log("#(1) node todo.js list                         ➤show all list todo");
    console.log("#(2) node todo.js add <task content>              ➤adding new task");
    console.log("#(3) node todo.js delete <task ID>                  ➤deleting task");
    console.log("#(4) node todo.js completed <task ID>           ➤Mark as completed");
    console.log("#(5) node todo.js uncompleted <task ID>       ➤Mark as uncompleted");
    console.log("#(6) node todo.js list:completed              ➤show completed list");
    console.log("#(7) node todo.js list:outstanding          ➤show uncompleted list");
    console.log("#(8) node todo.js tag <task ID> <tag>                ➤Tagging task");
    console.log("#(9) node todo.js filter <tag>                       ➤Tagging task");
    console.log("==================================================================");
  }
}//class view

class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
  }

  help(){
    return this.view.helpMenu()
  }

  addTask(task) {
    return this.model.createTask(task);
  }

  listAll() {
    return this.model.getList();
  }

  del(taskID) {
    return this.model.removeTask(taskID);
  }

  updateComplete(id){
    return this.model.markComplete(id);
  }

  unComplete(id){
    return this.model.markUncomplete(id);
  }

  uncompletedList(){
    return this.model.uncompletedList();
  }

  completedList(){
    return this.model.completedList();
  }

  tagTask(id, tag) {
    return this.model.createTag(id, tag)
  }

  tagList(tag) {
    return this.model.getListByTag(tag)
  }
}//class controller



let command = process.argv.slice(2)
let controller = new Controller();
controller.help()


if (command[0] === "add") {
  controller.addTask(command.slice(1).join(' '));
} else if (command[0] === "list") {
  controller.listAll();
} else if (command[0] === "delete") {
  controller.del(command.slice(1));
} else if (command[0] === "completed") {
  controller.updateComplete(command.slice(1));
} else if (command[0] === "uncompleted") {
  controller.unComplete(command.slice(1));
} else if (command[0] === "list:outstanding") {
  controller.uncompletedList();
} else if (command[0] === "list:completed") {
  controller.completedList();
} else if (command[0] === "tag") {
  controller.tagTask(command[1], command.slice(2).join(','));
} else if (command[0] === "filter") {
  controller.tagList(command.slice(1));
}
