const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createProductSchema, updateProductSchema } = require("../validations/product.validation");

router.use(authMiddleware);

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", validate(createProductSchema), productController.create);
router.put("/:id", validate(updateProductSchema), productController.update);
router.delete("/:id", productController.remove);

module.exports = router;
