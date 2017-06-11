'use strict';

let db = require("./models");

// model
function add(string){
  db.Todo.create({task:string, completed:0})
  .then(data =>{
    console.log(`Added ${data.task} to your TODO list...`);
  })
  .catch(err=>{
    console.log(err.message);
  })
}

function deletData(id_input){
  db.Todo.destroy({
    where:{
      id: id_input
    }
  }).then(() =>{
    console.log(`Deleted data with id: ${id_input} from your TODO list...`);
  })
}

function complete(id_input){
  db.Todo.findById(id_input)
  .then(find =>{
    find.update({
      completed: 1
    }).then(()=>{
      console.log(`Completed task with id: ${id_input} from your TODO list...`);
    })
  })
}

function uncomplete(id_input){
  db.Todo.findById(id_input)
  .then(find =>{
    completed: 0
  }).then(()=>{
    console.log(`UnCompleted task with id: ${id_input} from your TODO list...`);
  })
}

// view
function help() {
  let showArr = ["$ node todo.js # will call help", "$ node todo.js help",
  "$ node todo.js list", "$ node todo.js add <task_content>",
  "$ node todo.js task <task_id>", "$ node todo.js delete <task_id>",
  "$ node todo.js complete <task_id>", "$ node todo.js uncomplete <task_id>"];
  console.log(showArr.join("\n"));
}

function list(){
  db.Todo.findAll()
  .then(data =>{
    if (data.length > 0) {
      data.forEach(show =>{
        console.log(`${show.id}. [${show.completed ? "X" : " "}] ${show.task}`);
      })
    }else {
      console.log('empty task');
    }
  })
}


//controller
function run(param){
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
    default:
    console.log('Please input correct command');
      break;
  }
}

//Driver code
let arg = process.argv.slice(2,process.argv.length);
run(arg);
