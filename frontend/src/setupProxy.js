const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  //realizar proxy inverso en el server
  app.use(
    createProxyMiddleware("/reniec", {
      target: "https://api.reniec.cloud/dni",
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        "^/reniec": "",
      },
    })
  );
};
