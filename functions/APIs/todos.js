const { db } = require("../util/admin.js");

exports.getAllTodos = (request, response) => {
  db.collection("todos")
    .where("username", "==", request.user.username)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let todos = [];

      data.forEach((doc) => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
        });
      });
      return response.json(todos);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

// CRUD
exports.postOneTodo = (request, response) => {
  if (request.body.body.trim() === "") {
    response.status(400).json({ body: "Must not be empty" });
  }

  if (request.body.title.trim() === "") {
    response.status(400).json({ title: "Must not be empty" });
  }

  const newTodoItem = {
    username: request.user.username,
    title: request.body.title,
    body: request.body.body,
    createdAt: new Date().toISOString(),
  };
  db.collection("todos")
    .add(newTodoItem)
    .then((doc) => {
      const responseTodoItem = newTodoItem;
      responseTodoItem.id = doc.id;
      return response.json(responseTodoItem);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: "Something went wrong" });
    });
};

exports.deleteTodo = (request, response) => {
  const document = db.doc(`/todos/${request.params.todoId}`);

  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Todo doesnt exist" });
      }

      if (doc.data().username !== request.user.username) {
        response.status(403).json({ error: "UnAuthorized" });
      }
      return document.delete();
    })
    .then(() => {
      return response.json({ message: "Delete successfull" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.editTodo = (request, response) => {
  if (request.body.todoId || request.body.createdAt) {
    response.status(403).json({ message: "You are not allowed to edit this" });
  }

  let document = db.collection("todos").doc(`${request.params.todoId}`);

  document
    .update(request.body)
    .then(() => {
      return response.json({ message: "Updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({
        error: err.code,
      });
    });
};
