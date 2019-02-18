const nodeEnv = require("../helpers/nodeEnv");

const generalErrorHandlerMiddleware = (err, req, res, next) => {
  if (nodeEnv.isDev) console.error(require("util").inspect(err, { colors: true, depth: 1 }));

  res.status(err.status || 500).json({
    msg: err.message || "Error processing your request!"
  });
};

module.exports = generalErrorHandlerMiddleware;
