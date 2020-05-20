// Backend imports
const functions = require("firebase-functions");
const app = require("express")();

// Functions
const {
  getAllTodos,
  postOneTodo,
  deleteTodo,
  editTodo,
} = require("./APIs/todos");

// CRUD of the todos ////
app.post("/todo", postOneTodo);
app.delete("/todo/:todoId", deleteTodo);
app.put("/todo/:todoId", editTodo);

// Get of the APIs
app.get("/todos", getAllTodos);
exports.api = functions.https.onRequest(app);
