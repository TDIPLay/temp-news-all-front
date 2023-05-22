const path = require("path");
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.join(__dirname, "src/"),
      },
    },
  },

  devServer: {
    proxy: {
      "/api": {
        target: "http://console.news-all.co.kr/api",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
        secure: false,
      },
      "/api/-2": {
        target: "http://console.news-all.co.kr/Trand/tdi/talk/v1/datalab",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
        secure: false,
      },
    },
  },
});
