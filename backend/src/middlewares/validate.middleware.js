const { error } = require("../utils/response");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const issues = result.error.issues || [];
    const errors = issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return error(res, "Validation failed", 400, errors);
  }
  req.body = result.data;
  next();
};

module.exports = validate;
