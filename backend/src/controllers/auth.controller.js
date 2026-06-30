const authService = require("../services/auth.service");
const { success } = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    return success(res, data, "Registration successful", 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return success(res, data, "Login successful");
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const data = await authService.me(req.user.id);
    return success(res, data, "User retrieved");
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
