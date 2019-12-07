const express = require("express");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/auth");
const { trimAndMinLength } = require("../util/validator");

const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);

router.post(
  "/post",
  isAuth,
  [(trimAndMinLength("title", 5), trimAndMinLength("content", 5))],
  feedController.addPost
);

router.get("/post/:id", isAuth, feedController.getPost);

router.put(
  "/post/:id",
  isAuth,
  [(trimAndMinLength("title", 5), trimAndMinLength("content", 5))],
  feedController.updatePost
);

router.delete("/post/:id", isAuth, feedController.deletePost);

module.exports = router;
