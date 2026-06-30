const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createCategorySchema, updateCategorySchema } = require("../validations/category.validation");

router.use(authMiddleware);

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.post("/", validate(createCategorySchema), categoryController.create);
router.put("/:id", validate(updateCategorySchema), categoryController.update);
router.delete("/:id", categoryController.remove);

module.exports = router;
