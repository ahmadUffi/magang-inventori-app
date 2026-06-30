const productService = require("../services/product.service");
const { success } = require("../utils/response");

const getAll = async (req, res, next) => {
  try {
    const data = await productService.findAll(req.user.id, req.query);
    return success(res, data, "Products retrieved");
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await productService.findById(req.params.id, req.user.id);
    return success(res, data, "Product retrieved");
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await productService.create(req.user.id, req.body);
    return success(res, data, "Product created", 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await productService.update(req.params.id, req.user.id, req.body);
    return success(res, data, "Product updated");
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await productService.remove(req.params.id, req.user.id);
    return success(res, null, "Product deleted");
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
