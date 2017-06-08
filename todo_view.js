'use strict'

class TodoView {
  constructor() {
  }

  static showHelp() {
    console.log(`
      How to use the todo App :
      Use one of the following commands:
       - help
       - list
       - add <task_content>
       - task <task_id>
       - delete <task_id>
       - complete <task_id>
       - uncomplete <task_id>
      `);
  }

  static showMessage(message) {
    console.log(message);
  }

  static showTodo(todo) {
    console.log(todo);
  }

  static showError(message) {
    console.log('\x1b[31m', message);
  }

  static showTodoList(todoList) {
    // for (const [index, todo] of todoList.entries()) {
    for (let i = 0; i < todoList.length; i += 1) {
      const todo = todoList[i];
      // const completedMark = todo.completed ? 'X' : ' ';
      // console.log(`${i + 1}. [${completedMark}] ${todo.task} (${todo.tags.join(', ')})`);

      const completedMark = 'x';
      console.log(`${i + 1}. [${completedMark}] ${todo.task}`);

    }
  }

}

module.exports = TodoView;
