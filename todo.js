'use strict';
//write your code here

var Table = require('cli-table2');
var Color = require('colors');

class Model{
  constructor(){
    var table = new Table({
      head:['Id','Task','Date complete','complete','created at','updated at','tags'],
      colWidths:[5, 50, 10, 10, 50, 50, 30]
    })
    this.table = table;
    this.db = require('./models');
    this.View = new View(this.table);

  }
  mAdd(task){
    let taskmodel = task;
    this.db.todolist.create({
      task : taskmodel,
      date_complete : null,
      complete : "false",
      createdAt : new Date(),
      updatedAt : new Date()
    })
  }

  mList(){
    this.db.todolist
    .findAll()
    .then(todolist => {
      todolist.forEach(tdl =>{
        this.table.push([tdl.id, tdl.task, `${tdl.date_complete}`, tdl.complete, tdl.createdAt.toString(), tdl.updatedAt.toString(), tdl.tag]);
      })
      return this.View.vTable();
    })
  }

  mDelete(id){
    this.db.todolist.destroy({
      where : {id : id}
    })
    .then(()=>{
      this.mList()
    })
  }

  mComplete(idTodolist){
    this.db.todolist.update({
      complete: "true",
      date_complete: new Date()
      },{
        where: {id : idTodolist }
    })
    .then(()=>{
      this.mList();
    })
  }

  mUncomplete(idTodolist){
    this.db.todolist.update({
      complete: "false",
      date_complete: null
    },{
      where: {id : idTodolist}
    })
    .then(() =>{
      this.mList();
    })
  }

  mAddTag(tag){
    let id = tag[0];
    tag.shift();
    let tagged = tag.join(",");
    this.db.todolist.update({
      tag : tagged
    },{
      where : {"id" : id}
    })
  }

  mFilter(filter){
    this.db.todolist
    .findAll({
      where : {tag : {
        $like: '%'+filter+'%'
      }
    }
    })
    .then(datas =>{
      datas.forEach(data => {
        this.table.push([data.id, data.task, `${data.date_complete}`, data.complete, data.createdAt.toString(), data.updatedAt.toString(), data.tag]);
      })
      return this.View.vTable();
    })
  }

  mListComplete(){
    this.db.todolist
    .findAll({
      where: {complete: "true"}
    })
    .then(datas =>{
      datas.forEach(data =>{
        this.table.push([data.id, data.task, `${data.date_complete}`, data.complete, data.createdAt.toString(), data.updatedAt.toString(), data.tag]);
      })
      if(this.table.length == 0){
        return this.View.vDataKosong();
      } else {
        return this.View.vTable();
      }
    })
  }

  mListOutstandingAsc(){
    this.db.todolist
    .findAll({
      where: {complete: "false"},
      order: '"createdAt" ASC'
    })
    .then(datas =>{
      datas.forEach(data => {
        this.table.push([data.id, data.task, `${data.date_complete}`, data.complete, data.createdAt.toString(), data.updatedAt.toString(), data.tag])
      })
      return this.View.vTable();
    })
  }

  mListOutstandingDesc(){
    this.db.todolist
    .findAll({
      where: {complete: "false"},
      order: '"createdAt" DESC'
    })
    .then(datas =>{
      datas.forEach(data => {
        this.table.push([data.id, data.task, `${data.date_complete}`, data.complete, data.createdAt.toString(), data.updatedAt.toString(), data.tag])
      })
      return this.View.vTable();
    })
  }
}

class Controller{
  constructor(){
    this.Model = new Model();
    this.View = new View();
  }
  run(pointer){
    switch (pointer[0]) {
      case "help":
        this.View.header();
        break;
      case "add":
        if(pointer[1] == null){
          this.View.vInputKosong();
          this.View.header();
        }else{
          pointer.shift();
          this.Model.mAdd(pointer.join(" "));
          this.View.vAdd(pointer.join(" "));
        }
        break;
      case "list":
        this.Model.mList();
        this.View.vList();
        break;
      case "delete":
        pointer.shift()
        this.Model.mDelete(pointer);
        this.View.vDelete(pointer);
        break;
      case "complete":
        pointer.shift();
        this.Model.mComplete(pointer)
        this.View.vComplete();
        break;
      case "uncomplete":
        pointer.shift();
        this.Model.mUncomplete(pointer);
        break;
      case "tags":
        let idTags = pointer[1];
        pointer.shift();
        this.Model.mAddTag(pointer);
        this.View.vTags(idTags);
        break;
      case "filter":
        pointer.shift();
        this.Model.mFilter(pointer);
        break;
      case "list:complete":
        pointer.shift();
        this.Model.mListComplete(pointer);
        break;
      case "list:outstanding":
        if(pointer[1] == null){
          //asc
          pointer.shift();
          this.Model.mListOutstandingAsc()
        } else if (pointer [1] == "asc"){
          //asc
          pointer.shift();
          this.Model.mListOutstandingAsc()
        } else if (pointer[1] == "desc"){
          pointer.shift();
          this.Model.mListOutstandingDesc();
        }
        break;
      default:
        this.View.vNoPilihan();

    }
  }
}

class View{
  constructor(table){
    this.table = table
  }
  header(){
    console.log('======================= help ============================');
    console.log('berikut perintah yang dapat digunakan untuk aplikasi todo');
    console.log('1. node todo.js <help>');
    console.log('2. node todo.js <add> <task>');
    console.log('3. node todo.js <list>');
    console.log('4. node todo.js <delete> <id>');
    console.log('5. node todo.js <complete> <id todolist>');
    console.log('6. node todo.js <uncomplete> <id todolist>');
    console.log('7. node todo.js <tags> <tag>');
    console.log('8. node todo.js <filter> <as tag>');
    console.log('9. node todo.js <list:complete>');
    console.log('10. node todo.js <list:outstanding> <asc/desc>');
  }

  vTable(){
    console.log(this.table.toString());
  }
  vAdd(task){
    console.log(`task ${task} sudah selesai dimasukkan.`);
  }

  vList(){
    console.log("List todo");
  }

  vDelete(id){
    console.log(`Delete task dengan id ${id}`);
  }

  vComplete(){
    console.log(`Daftar list complete`);
  }

  vTags(id){
    console.log(`Task dengan id ${id} sudah berhasil di update`);
  }

  vDataKosong(){
    console.log('Data kosong');
  }

  vInputKosong(){
    console.log('input kosong, masukkan input yang sesuai');
  }

  vNoPilihan(){
    console.log("anda salah/tidak menginputkan pilihan");
  }
}

let argv = process.argv.slice(2, process.argv.length);
let ctrl = new Controller();
ctrl.run(argv);
