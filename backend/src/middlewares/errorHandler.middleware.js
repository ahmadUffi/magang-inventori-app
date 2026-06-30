const { error } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return error(res, message, statusCode, err.errors || null);
};

module.exports = errorHandler;
