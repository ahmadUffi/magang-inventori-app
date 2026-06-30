const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/dashboard", require("./dashboard.routes"));
router.use("/categories", require("./category.routes"));
router.use("/products", require("./product.routes"));
router.use("/transactions", require("./transaction.routes"));

module.exports = router;
