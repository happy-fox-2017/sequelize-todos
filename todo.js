'use strict';

let db = require("./models");

// model
function add(string) {
  db.Todo.create({
      task: string,
      completed: 0
    })
    .then(data => {
      console.log(`Added ${data.task} to your TODO list...`);
    })
    .catch(err => {
      console.log(err.message);
    })
}

function deletData(id_input) {
  db.Todo.destroy({
    where: {
      id: id_input
    }
  }).then(() => {
    console.log(`Deleted data with id: ${id_input} from your TODO list...`);
  })
}

function complete(id_input) {
  db.Todo.findById(id_input)
    .then(find => {
      find.update({
        completed: 1
      }).then(() => {
        console.log(`Completed task with id: ${id_input} from your TODO list...`);
      })
    })
}

function uncomplete(id_input) {
  db.Todo.findById(id_input)
    .then(find => {
      completed: 0
    }).then(() => {
      console.log(`UnCompleted task with id: ${id_input} from your TODO list...`);
    })
}

function addTag(tag) {
  let id = tag[0];
  tag.shift();
  let tagged = tag.join(",");
  db.Todo.update({
    tag: tagged
  }, {
    where: {
      "id": id
    }
  })
  .then(() => {
    console.log(`id: ${id} has been added with tag ${tagged}`);
  })
}

function filters(filter) {
  db.Todo
    .findAll({
      where: {
        tag: {
          $like: '%' + filter + '%'
        }
      }
    })
    .then(data => {
      if (data.length > 0) {
        data.forEach(show => {
          console.log(`${show.id}. [${show.completed ? "X" : " "}] ${show.task} [${show.tag ? show.tag : ''}]`);
        })
      } else {
        console.log('empty task');
      }
    })
}

function listComplete() {
  db.Todo
    .findAll({
      where: {
        completed: 1
      }
    })
    .then(data => {
      if (data.length > 0) {
        data.forEach(show => {
          console.log(`${show.id}. [${show.completed ? "X" : " "}] ${show.task} [${show.tag ? show.tag : ''}]`);
        })
      } else {
        console.log('empty task');
      }
    })
}

function listOutstandingAsc() {
  db.Todo
    .findAll({
      where: {
        completed: 0
      },
      order: '"createdAt" ASC'
    })
    .then(data => {
      if (data.length > 0) {
        data.forEach(show => {
          console.log(`${show.id}. [${show.completed ? "X" : " "}] ${show.task} [${show.tag ? show.tag : ''}]`);
        })
      } else {
        console.log('empty task');
      }
    })
}


function listOutstandingDesc() {
  db.Todo
    .findAll({
      where: {
        completed: 0
      },
      order: [
        ['id', 'DESC']
      ]
    })
    .then(data => {
      if (data.length > 0) {
        data.forEach(show => {
          console.log(`${show.id}. [${show.completed ? "X" : " "}] ${show.task} [${show.tag ? show.tag : ''}]`);
        })
      } else {
        console.log('empty task');
      }
    })
}

// view
function help() {
  let showArr = ["$ node todo.js # will call help", "$ node todo.js help",
    "$ node todo.js list", "$ node todo.js add <task_content>",
    "$ node todo.js task <task_id>", "$ node todo.js delete <task_id>",
    "$ node todo.js complete <task_id>", "$ node todo.js tags <task_id> <desired_tag>",
    "$ node todo.js filter <desired_tag>", "$ node todo.js list:complete",
    "$ node todo.js list:outstanding <asc_or_desc>"
  ];
  console.log(showArr.join("\n"));
}

function list() {
  db.Todo.findAll({
      order: [
        ['id', 'ASC']
      ]
    })
    .then(data => {
      if (data.length > 0) {
        data.forEach(show => {
          console.log(`${show.id}. [${show.completed ? "X" : " "}] ${show.task} [${show.tag ? show.tag : ''}]`);
        })
      } else {
        console.log('empty task');
      }
    })
}


//controller
function run(param) {
  switch (param[0]) {
    case "help":
      help();
      break;
    case "list":
      list();
      break;
    case "add":
      param.shift();
      add(param.join(" "));
      break;
    case "delete":
      deletData(param[1]);
      break;
    case "complete":
      complete(param[1]);
      break;
    case "uncomplete":
      uncomplete(param[1]);
      break;
    case "tags":
      let idTags = param[1];
      param.shift();
      addTag(param);
      // tags(idTags);
      break;
    case "filter":
      param.shift();
      filters(param);
      break;
    case "list:complete":
      param.shift();
      listComplete(param);
      break;
    case "list:outstanding":
      if (param[1] == null) {
        //asc
        param.shift();
        listOutstandingAsc()
      } else if (param[1] == "asc") {
        //asc
        param.shift();
        listOutstandingAsc()
      } else if (param[1] == "desc") {
        param.shift();
        listOutstandingDesc();
      }
      break;
    default:
      console.log('Please input correct command');
      break;
  }
}

//Driver code
let arg = process.argv.slice(2, process.argv.length);
run(arg);