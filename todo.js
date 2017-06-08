'use strict';

const db = require('./models');


const Sequelize = require('sequelize');
const sequelize = new Sequelize('Todos', 'hacktiv8-11', null, {
  host: 'localhost',
  dialect: 'postgres'
});


class View {
  constructor() {}

  displayHelp(){
    console.log('_______________________________________________________________');
    console.log('                            Help Menu                          ');
    console.log('‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾');
    console.log(' add <task>                    Adding new task'                );
    console.log(' addtag <task_id tag>          Adding new task'                );
    console.log(' delete <task_id>              Delete task by Id'              );
    console.log(' completed <task_id>           Mark task as complete by Id'    );
    console.log(' completedlist                 Order by updatedAt'             );
    console.log(' list                          Show all ToDo list'             );
    console.log(' listbytag <tag>               View by tag'                    );
    console.log(' uncompleted <task_id>         Mark task as uncompeleted by Id');
    console.log(' uncompletedlist               Order by createdAt'             );
    console.log('_______________________________________________________________');
  }



  displayList() {
    console.log('\n');
    db.Todo.findAll({order: [['id', 'ASC']]})
    .then(list => {
      list.forEach(Todo => {
        if (Todo.completed === true) {
          console.log(`${Todo.id}. Task: ${Todo.task}. Tag: ${Todo.tag} ✓✓`);
        } else {
          console.log(`${Todo.id}. Task: ${Todo.task}. Tag: ${Todo.tag} ✘✘`);
        }
      })
    })

  } // displayList

  displayListCompleted() {
    console.log('\n');
    db.Todo.findAll({order: [['updatedAt', 'ASC']]})
    .then(list => {
      list.forEach(Todos => {
        if (Todos.completed === true) {
          console.log(`${Todos.id}. ${Todos.task} ✓✓ ${Todos.updatedAt}`);
        }
      })
    })
  }

  displayListUncompleted() {
    console.log('\n');
    db.Todo.findAll({order: [['createdAt', 'ASC']]})
    .then(list => {
      list.forEach(Todos => {
        if (Todos.completed === false) {
          console.log(`${Todos.id}. ${Todos.task} ✘✘ ${Todos.createdAt}`);
        }
      })
    })
  }

  displayByTag(contentOrId) {
    console.log(('\n'));
    db.Todo.findAll({where : {tag : contentOrId}})
    .then(list => {
      list.forEach(Todos => {
        console.log(`${Todos.id}. ${Todos.task}`);
      })
    })
  }

  displayAdd(todoTask) {
    console.log('\n');
    db.Todo.create(
      {
        task      : todoTask,
        completed : false,
        createdAt : new Date(),
        updatedAt : new Date()
      })
      .then(Todo => {
        console.log(`Add ${Todo.task} to your list.`);
      })
      .catch(err => {
        console.log(`Error: ${err.message}`);
      });
  } // displayAdd

  displayAddTag(contentOrId, tag) {
    db.Todo.update({
      tag : tag
    },{
      where : {
        id : id
      }
    })
  }

  displayDelete(todoId) {
    console.log('\n');
    db.Todo.destroy({
      where : {
        id : todoId
      }
    })
    .then(() => {
      console.log(`Task with ID ${todoId} has deleted.`);
    })
    .catch(err => {
      console.log(`Error: ${err.message}`);
    })
  } // displayDelete

  displayMark(todoId, status) {
    let mark;

    if (status === true) {
      mark = 'completed';
    } else {
      mark = 'uncompleted';
    }

    console.log('\n');

    db.Todo.update({
      completed : status
    }, {
      where : {
        id : todoId
      }
    })
    .then(() => {
      console.log(`Todo list with id ${todoId} has been ${mark}`);
    })
    .catch(() => {
      console.log(err.message)
    })
  } // displayMark


  displayError() {
    console.log("Command not found, type 'help' for command list");
  }

} // class View

class Controller {
  constructor() {
    this._view = new View();
  }

  executeMenu(option, contentOrId) {
    let status = false;

    if(option == "help") {
      return this._view.displayHelp();
    } else if (option == 'list') {
      return this._view.displayList();
    } else if (option == 'add') {
      return this._view.displayAdd(contentOrId);
    } else if (option == 'delete') {
      return this._view.displayDelete(contentOrId);
    } else if (option == 'completed') {
      status = true;
      return this._view.displayMark(contentOrId, status);
    } else if (option == 'uncompleted') {
      return this._view.displayMark(contentOrId, status);
    } else if (option == 'completedlist') {
      return this._view.displayListCompleted();
    } else if (option == 'uncompletedlist') {
      return this._view.displayListUncompleted();
    } else if (option == 'listbytag') {
      return this._view.displayByTag(contentOrId);
    } else if (option == 'addtag') {
      return this._view.displayAddTag(contentOrId, tag);
    } else {
      return this._view.displayError();
    }
  } // executeMenu
} // class Controller

let argv =process.argv;
let option = argv[2];
let contentOrId = argv[3];
let tag = argv.slice(3).join(' ');
let controller = new Controller();

controller.executeMenu(option, contentOrId)
