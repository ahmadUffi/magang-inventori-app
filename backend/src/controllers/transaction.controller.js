const transactionService = require("../services/transaction.service");
const { success } = require("../utils/response");

const getAll = async (req, res, next) => {
  try {
    const data = await transactionService.findAll(req.user.id, req.query);
    return success(res, data, "Transactions retrieved");
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await transactionService.create(req.user.id, req.body);
    return success(res, data, "Transaction created", 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create };
