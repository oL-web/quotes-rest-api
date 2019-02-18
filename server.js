require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");

const log = require("./helpers/log");
const nodeEnv = require("./helpers/nodeEnv");
const apiRoute = require("./routes/api");
const passportConfig = require("./config/passport");
const notFoundMiddleware = require("./middleware/notFound");
const generalErrorHandlerMiddleware = require("./middleware/generalErrorHandler");

const { MONGO_USER, MONGO_PWD, MONGO_URI, MONGO_TEST_URI, PORT } = process.env;
const app = express();
const port = PORT || 8080;

mongoose.connect(nodeEnv.isTest ? MONGO_TEST_URI : MONGO_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  user: MONGO_USER,
  pass: MONGO_PWD
});
mongoose.connection.once("open", () => log("Connected to MongoDB"));
mongoose.connection.on("error", log);

if (nodeEnv.isProduction) app.set("trust proxy", 1);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
passportConfig();

app.use("/api", apiRoute);

app.use(notFoundMiddleware);
app.use(generalErrorHandlerMiddleware);

module.exports = app.listen(port, () => log(`Express server listening on port ${port} in ${nodeEnv.env} mode`));
