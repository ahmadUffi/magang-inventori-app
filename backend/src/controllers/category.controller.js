const categoryService = require("../services/category.service");
const { success } = require("../utils/response");

const getAll = async (req, res, next) => {
  try {
    const { categories, total } = await categoryService.findAll(req.user.id, req.query);
    return success(res, { categories, total }, "Categories retrieved");
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await categoryService.findById(req.params.id, req.user.id);
    return success(res, data, "Category retrieved");
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await categoryService.create(req.user.id, req.body);
    return success(res, data, "Category created", 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await categoryService.update(req.params.id, req.user.id, req.body);
    return success(res, data, "Category updated");
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await categoryService.remove(req.params.id, req.user.id);
    return success(res, null, "Category deleted");
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
