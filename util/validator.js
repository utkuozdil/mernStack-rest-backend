const { body } = require("express-validator");

exports.trimAndNotEmpty = field => {
  return body(field)
    .trim()
    .not()
    .isEmpty();
};

exports.trimAndMinLength = (field, length) => {
  return body(field)
    .trim()
    .isLength({ min: length });
};
