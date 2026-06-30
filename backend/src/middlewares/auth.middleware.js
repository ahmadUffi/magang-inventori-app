const { verify } = require("../utils/jwt");
const { error } = require("../utils/response");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, "Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verify(token);
    req.user = decoded;
    next();
  } catch {
    return error(res, "Token invalid or expired", 401);
  }
};

module.exports = authMiddleware;
