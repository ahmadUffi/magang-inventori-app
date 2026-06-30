const express = require("express");
const cors = require("cors");
const requestLogger = require("./middlewares/requestLogger.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");
const routes = require("./routes");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(requestLogger);

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
