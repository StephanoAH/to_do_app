const { admin, db } = require("./admin");

module.exports = (request, response, next) => {
  let idToken;

  if (
    request.header.authorization &&
    request.header.authorization.startWith("Bearer ")
  ) {
    idToken = request.header.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    response.status(403).json({ error: "You are not authorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      request.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", request.user.uid)
        .limit(1)
        .get();
    })
    .catch((err) => {
      console.error("error while verifying token", err);
      return response.status(403).json(err);
    });
};
