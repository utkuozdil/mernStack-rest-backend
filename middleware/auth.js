const jsonwebtoken = require("jsonwebtoken");

module.exports = (request, response, next) => {
  const authorizationHeader = request.get("Authorization");
  if (!authorizationHeader) {
    const error = new Error("not authenticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authorizationHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jsonwebtoken.verify(token, "topsecret");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("not authenticated");
    error.statusCode = 401;
    throw error;
  }
  request.userId = decodedToken.userId;
  next();
};
