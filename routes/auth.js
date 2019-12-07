const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/auth");
const { trimAndNotEmpty, trimAndMinLength } = require("../util/validator");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("not valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDocument => {
          if (userDocument) return Promise.reject("email already exists");
        });
      })
      .normalizeEmail(),
    trimAndMinLength("password", 5),
    trimAndNotEmpty("name")
  ],
  authController.signup
);

router.post("/login", authController.login);

router.get("/status", isAuth, authController.getUserStatus);

router.patch(
  "/status",
  isAuth,
  [trimAndNotEmpty("status")],
  authController.updateUserStatus
);

module.exports = router;
