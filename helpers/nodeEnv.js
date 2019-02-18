const env = process.env.NODE_ENV || "development";

module.exports = {
  env,
  isProduction: env === "production",
  isTest: env === "test",
  isDev: env === "development"
};
