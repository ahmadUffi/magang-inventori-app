const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createTransactionSchema } = require("../validations/transaction.validation");

router.use(authMiddleware);

router.get("/", transactionController.getAll);
router.post("/", validate(createTransactionSchema), transactionController.create);

module.exports = router;
