const express = require("express");
const requestLogger = require("./middlewares/requestLogger.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
