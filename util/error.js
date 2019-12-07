exports.validationError = errors => {
  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
};

exports.errorWithStatusCodeAndMessage = (statusCode, errorMessage) => {
  const error = new Error(errorMessage);
  error.statusCode = statusCode;
  throw error;
};
