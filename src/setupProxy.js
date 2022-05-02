const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(["/app/*", "/api/*"], { target: "https://secret-ridge-44451.herokuapp.com/" })
  );
};