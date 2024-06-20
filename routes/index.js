var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const todosFilePath = path.join(__dirname, '../data/todos.json');

function loadTodos() {
  try {
    const data = fs.readFileSync(todosFilePath, 'utf8');
    const todos = JSON.parse(data);
    return Array.isArray(todos) ? todos : [];
  } catch (error) {
    console.error("Error reading the todos.json:", error);
    return [];
  }
}

function saveTodos(todos) {
  try {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error("Error writing to the todos.json:", error);
  }
}

router.get('/', function(req, res, next) {
  try {
    const todos = loadTodos();
    res.render('index', { title: 'To do list', todos });
  } catch (error) {
    console.error("Error loading todos:", error);
    res.status(500).send("Error loading todos");
  }
});

router.post('/add', (req, res) => {
  try {
    const todos = loadTodos();
    const newTodo = req.body.content;
    if (newTodo) {
      todos.push({ content: newTodo });
      saveTodos(todos);
    }
    res.redirect('/');
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).send("Error adding todo");
  }
});

router.post('/delete/:index', (req, res) => {
  try {
    const todos = loadTodos();
    const index = parseInt(req.params.index, 10);
    if (!isNaN(index)) {
      todos.splice(index, 1);
      saveTodos(todos);
    }
    res.redirect('/');
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).send("Error deleting todo");
  }
});

router.post('/edit/:index', (req, res) => {
  try {
    const todos = loadTodos();
    const index = parseInt(req.params.index, 10);
    const newContent = req.body.content;
    if (!isNaN(index) && newContent) {
      todos[index].content = newContent;
      saveTodos(todos);
    }
    res.redirect('/');
  } catch (error) {
    console.error("Error editing todo:", error);
    res.status(500).send("Error editing todo");
  }
});

module.exports = router;
