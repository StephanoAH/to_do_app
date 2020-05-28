// Backend imports
const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");

// Functions
const {
  getAllTodos,
  postOneTodo,
  deleteTodo,
  editTodo,
} = require("./APIs/todos");

const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails,
} = require("./APIs/users");

// CRUD of the todos ////
app.post("/todo", postOneTodo);
app.delete("/todo/:todoId", deleteTodo);
app.put("/todo/:todoId", editTodo);

// User
app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetail);
app.post("/user", auth, updateUserDetails);

// Get of the APIs
app.get("/todos", getAllTodos);
exports.api = functions.https.onRequest(app);
