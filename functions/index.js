const functions = require("firebase-functions");
const app = require("express")();

const { getAllTodos, postOneTodo, deleteTodo } = require("./APIs/todos");

app.post("/todo", postOneTodo);
app.post("/todo/:todoId", deleteTodo);

app.get("/todos", getAllTodos);
exports.api = functions.https.onRequest(app);
