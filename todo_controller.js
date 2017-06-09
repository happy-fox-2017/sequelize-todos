const TodoView = require('./todo_view');
const TodoModel = require('./todo_model');

const models = require('./models');

const Todo = models.Todo;
const Tag = models.Tag;

const TodoDataService = TodoModel.TodoDataService;
const FILE_NAME = 'data.json';

class TodoController {

  constructor() {
    this.todoView = new TodoView();
    this.todoDataService = new TodoDataService(FILE_NAME);
  }

  processCommand(commands) {
    const command = commands[0];
    const commandArg1 = commands[1];

    switch (command) {
      case 'help':
        TodoController.handleHelp();
        break;
      case 'list':
        this.handleListTodo();
        break;
      case 'add':
        this.handleAddTodo(commandArg1);
        break;
      case 'task':
        this.handleViewTodo(commandArg1);
        break;
      case 'delete':
        this.handleDeleteTodo(commandArg1);
        break;
      case 'complete':
        this.handleCompleteTodo(commandArg1);
        break;
      case 'uncomplete':
        this.handleUncompleteTodo(commandArg1);
        break;
      case 'list:outstanding':
        this.handleListOutstanding(commandArg1);
        break;
      case 'list:completed':
        this.handleListCompleted(commandArg1);
        break;
      case 'tag':
        this.handleAddTags(commandArg1, commands.slice(2));
        break;
      default:
        this.handleExtendedCommand(commands);
        break;
    }
  }

  static handleHelp() {
    TodoView.showHelp();
  }

  handleListTodo() {
    // const todoList = this.todoDataService.getTodoList();

    Todo.findAll()
    .then((rows) => {
      TodoView.showTodoList(rows);
    })

  }

  handleAddTodo(taskDescription) {
    // this.todoDataService.addTodo(taskDescription);
    // TodoView.showMessage(`Appended ${taskDescription} to your TODO list...`);
    Todo.create({
      task: taskDescription
    })
    .then(() => {
      TodoView.showMessage(`Appended ${taskDescription} to your TODO list...`);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleDeleteTodo(taskId) {
    // this.todoDataService.deleteTodo(taskId);
    // TodoView.showMessage(`Task with id (${taskId}) has been deleted...`);
    Todo.destroy({ where: {
      id: taskId
    }})
    .then(() => {
       TodoView.showMessage(`Task with id (${taskId}) has been deleted...`);
    })
    .catch((err) => {
      console.log(err);
    });




  }

  handleViewTodo(taskId) {
    // try {
    //   const todo = this.todoDataService.getTodoById(taskId);
    //   TodoView.showTodo(todo);
    // } catch (err) {
    //   TodoView.showError(err.toString());
    // }

    Todo.findOne({ where: { id: taskId}})
    .then((todo)=>{
      TodoView.showTodo(todo);
    })
  }

  handleCompleteTodo(taskId) {
    // try {
    //   this.todoDataService.completeTodo(taskId);
    //   TodoView.showMessage(`Task with id (${taskId}) has been completed...`);
    // } catch (err) {
    //   TodoView.showError(err.toString());
    // }
    Todo.findOne({ where: { id: taskId}})
    .then((todo)=>{
      todo.status = 1;
      todo.completedAt = new Date();
      todo.save()
      .then( () => {
        // console.log(todo);
      })
    })



  }

  handleUncompleteTodo(taskId) {
    Todo.findOne({ where: { id: taskId}})
    .then((todo)=>{
      todo.status = 0;
      todo.completedAt = null;
      todo.save()
      .then( () => {
        // console.log(todo);
      })
    })
  }

  handleListOutstanding(sorting) {
    // const todoList = this.todoDataService.getOutstandingTodoList(sorting);
    // TodoView.showTodoList(todoList);

    Todo.findAll()
    .then((todoList) => {
      todoList = todoList.filter(todo => !todo.getCompleted());
      if (sorting === 'DESC') {
        todoList = todoList.sort((todo1, todo2) => todo2.createdAt - todo1.createdAt);
      } else {
        todoList = todoList.sort((todo1, todo2) => todo1.createdAt - todo2.createdAt);
      }
      TodoView.showTodoList(todoList);
    })



  }

  handleListCompleted(sorting) {
    // const todoList = this.todoDataService.getCompletedTodoList(sorting);
    // TodoView.showTodoList(todoList);

    Todo.findAll()
    .then((todoList) => {
      todoList = todoList.filter(todo => todo.getCompleted());
      if (sorting === 'DESC') {
        todoList = todoList.sort((todo1, todo2) => todo2.completedAt - todo1.completedAt);
      } else {
        todoList = todoList.sort((todo1, todo2) => todo1.completedAt - todo2.completedAt);
      }
      TodoView.showTodoList(todoList);
    })
  }

  handleAddTags(taskId, tags) {
    // try {
    //   const modifiedTodo = this.todoDataService.addTags(taskId, tags);
    //   TodoView.showMessage(`Tagged task "${modifiedTodo.task}" with tags: ${modifiedTodo.tags.join(', ')}`);
    // } catch (err) {
    //   TodoView.showError(err.toString());
    // }
    const promises = [];
    for(let i = 0; i < tags.length; i += 1) {
      const tagtext = tags[i];
      promises.push(Tag.create({tagtext: tagtext}));
    }

    Promise.all(promises).then((values) => {
        Todo.findOne({ where: { id: taskId}})
        .then((todo) => {
          todo.setTags(values)
          .then(() => {
            TodoView.showMessage(`Tagged todo "${todo.task}"`);
            return true;
          })
        });
    })

  }

  handleExtendedCommand(commands) {
    const matchCommands = commands[0].match(/(filter):(\w+)/) || [];
    if (matchCommands.length > 0 && matchCommands[1] === 'filter') {
      const tag = matchCommands[2];
      // const todoList = this.todoDataService.getTodoListByTag(tag);
      // TodoView.showTodoList(todoList);
      Todo.findAll({
        include: [{
          model: Tag,
          where: { tagtext: tag}
        }]
      })
      .then((rows) => {
        TodoView.showTodoList(rows);
      })
    } else {
      TodoController.handleUnknownCommand();
    }
  }
  static handleUnknownCommand() {
    TodoView.showMessage('Unknown command.');
  }
}

module.exports = TodoController;
