'use strict';

//write your code here
let db = require('./models')
// const repl = require('repl')
// const replServer = repl.start('>> ')


class Task {
  constructor(task,status=false,tag='') {
    this.task = task
    this.complete = status
    this.tag = tag
  }
}


class Controller {
  constructor() {
    this.view = new View()
  }
  
  run () {
    let command = process.argv[2]
    let parameter = process.argv.slice(3).join(" ")
    switch (command) {
      case "help":
      this.view.showHelp()
      break;
      case "list":
      this.showTasks()
      break;
      case "add":
      return this.add(new Task(parameter))
      // this.view.confirmAddTask(parameter)
      break;
      case "task":
      this.showTask(parameter);
      break;
      case "tag":
      let paramArr = parameter.split(" ");
      let id = paramArr[0];
      let tag = paramArr[1];
      this.tag(id,tag)
      break;
      case "delete":
      this.deleteTask(parameter)
      // this.view.confirmDeleteTask(parameter)
      break;
      case "check":
      this.complete(parameter)
      // this.view.confirmCompleteTask(parameter)
      break;
      case "uncheck":
      this.uncomplete(parameter)
      // this.view.confirmUncompleteTask(parameter)
      break;
      case "list:outstanding":
      if (parameter == "asc" || parameter == '') {
        this.ascOutStanding()
      } else if (parameter == "dsc") {
        this.dscOutStanding()
      } else {
        this.view.showErrorParameter();
      }
      // this.ascOutStanding();
      // this.dscOutStanding();
      break;
      case "list:completed":
      if (parameter == "asc") {
        this.ascComplete()
      } else if (parameter == "dsc") {
        this.dscComplete()
      } else {
        this.ascComplete();
      }
      break;
      case "list:uncompleted":
      this.uncomplete();
      break;
      case "filter":
      break;
      this.filterByTag(parameter);
      break;
      case undefined:
      this.view.showHelp()
      break;
      default:
      this.view.showErrorCommand()
    }
  }
  
  add(task) {
    db.Task.create(task)
    .then(task => {
      this.view.confirmAddTask(task.task)
    })
    .catch(err => {
      this.showErrorQuery(err);
    })
  }

  showTasks() {
    db.Task.findAll()
    .then((data) =>{
      this.view.showTaskList(data)
    })
    .catch(function (err) {
      console.log(err);
    })
  } 

  showTask(id) {
    db.Task.findOne({where:{id : id}})
    .then(task => {
      this.view.showTaskDetail(task)
    })
    .catch(err => {
      this.view.showErrorQuery(err);
    })
  }
  
  updateTask(id,task) {
    db.Task.update(
        {'task' : task},
        {where: {'id' : id}}
    )
    .then((data) => {
      this.view.confirmUpdateTask(data.task)
    })
    .catch( (err) => {
      this.view.showErrorQuery(err);
    })
  }

  deleteTask(id) {
    db.Task.destroy( {
      where : {'id' : id}
    })
    .then( () => {
      this.view.confirmDeleteTask(id)
    })
    .catch( (err) => {
      this.view.showErrorQuery(err);
    })
  }
  
  tag (id, tag) {
    db.Task.update(
      {'tag' : tag },
      {where : {'id' : id}}
    )
    .then( task => {
      this.view.confirmAddedTag(id,tag);
    })
    .catch( err => {
      this.view.showErrorQuery(err);
    })  
  }
  
  complete (id) {
    db.Task.update(
      {complete:true},
      {where:{'id':id}}
    )
    .then( task => {
      this.view.confirmCompleteTask(task.task)
    })
    .catch(err => {
      this.view.showErrorQuery(err)
    })
  }
  
  uncomplete (id) {
    db.Task.update(
      {complete:true},
      {where:{'id':id}}
    )
    .then( task => {
      this.view.confirmCompleteTask(task.task)
    })
    .catch(err => {
      this.view.showErrorQuery(err)
    })
  }
  
  
  filterByTag(tag) {
    db.Task.findAll(
      {where : {'tag' : tag}}
    )
    .then( tasks => {
      console.log(tasks);
      this.view.showTaskList(tasks)
    })
    .catch(err => {
      this.view.showErrorQuery(err)
    })
  }
  
  ascOutStanding () {
    db.Task.findAll(
      {order: [['id', 'ASC']]}
    )
    .then(tasks => {
      this.view.showUncompletedTask(tasks)
    })
    .catch(err => {
      this.view.showErrorQuery(err)
    })
  }
  
  dscOutStanding () {
    db.Task.findAll(
      {order : [["id", "DESC"]]}
    ) 
    .then(tasks => {
      this.view.showUncompletedTask(tasks)
    })
    .catch ( err => {
      this.view.showErrorQuery();
    })
  }
  
  ascComplete () {
    db.Task.findAll(
      {order : [['id', 'ASC']]}
    )
    .then(tasks => {
      this.view.showCompletedTask(tasks)
    })
    .catch(err => {
      this.view.showErrorQuery(err)
    })
  }
  
  dscComplete () {
    db.Task.findAll(
      { order : ['id', "DESC"]}
    )
    .then(tasks => {
      this.view.showTaskList(tasks)
    })
    .catch(err => {
      this.view.showErrorQuery(err)
    })
  }
}

class View {
  constructor() {}

  showHelp() {
    console.log("help > show help");
    console.log("list > show list task");
    console.log("add [task] > show task");
    console.log("tag [task number] [new tag] > add tags");
    console.log("task [task number] > task detail");
    console.log("delete [task number] > delete task");
    console.log("check [task number] > check task");
    console.log("uncheck [task number] > uncheck task");
    console.log("list:outstanding asc | dsc > sort based on date completed");
    console.log("list:completed asc | dsc > sort based on task id");
    console.log("filter [tag name] > sorted by tag");
    return 0;
  }

  showTaskList(objTasks) {
    objTasks.forEach(task => {
      if (task.complete) {
        console.log(`${task.id}. ${task.task} [COMPLETE]`);
      } else {
        console.log(`${task.id}. ${task.task} `);
      }
    })
  }

  showCompletedTask(objTasks) {
    objTasks.forEach(task => {
      if (task.complete) {
        console.log(`${task.id}. ${task.task} [COMPLETE]`);
      }
    })
  }

  showUncompletedTask(objTasks) {
    objTasks.forEach(task => {
      if (!task.complete) {
        console.log(`${task.id}. ${task.task} `);
      }
    })
  }

  showTaskDetail(objTask) {
    console.log(`Detail Task :\n`);
    console.log("id : ", objTask.id);
    console.log("Completed status : ", objTask.complete);
    console.log("isi Task : ", objTask.task);
  }

  showTaskByTag(objTasks, tag) {
    console.log(`Task with ${tag} tag :`);
    objTasks.forEach(task => {
      this.showTaskDetail(task)
    })
  }

  confirmAddTask(taskName) {
    console.log(`Task ${taskName} added`);
  }

  confirmDeleteTask(taskID) {
    console.log(`Task ${taskID} deleted`);
  }

  confirmCompleteTask(taskName) {
    console.log(`Task ${taskName} completed, Awesome !`);
  }

  confirmUncompleteTask(taskName) {
    console.log(`Task ${taskName} mark as uncomplete`);
  }

  confirmAddedTag(id, tag) {
    console.log(`Tagged Task id ${id} with tags: ${tag}`);
  }
  
  confirmUpdateTask(taskName) {
    console.log(`Task ${taskName} has been updated`);
  }
  
  


  showErrorCommand() {
    console.log("your command is not valid");
    return 0;
  }

  showErrorParameter() {
    console.log("your Parameter is not valid");
    return 0;
  }
  
  showErrorQuery(err) {
    console.log(err);
  }

}

let todo = new Controller()
todo.run()

// replServer.context.insert = insert
// replServer.context.getAllData = getAllData
// replServer.context.updateData = updateData
// replServer.context.deleteData = deleteData


