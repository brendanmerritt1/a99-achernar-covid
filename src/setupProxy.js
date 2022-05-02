const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(["/app/*", "/api/*"], { target: "http://localhost:5555" })
  );
};