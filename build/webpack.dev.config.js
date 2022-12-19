const path = require("path");
const merge = require('webpack-merge')
const commonConfig = require('./webpack.base.config.js')
const webpack = require("webpack");

module.exports = merge(commonConfig, {
  mode: "development",
  entry: ["react-hot-loader/patch"],
  devtool: 'inline-cheap-module-source-map',
  // devtool: 'hidden-nosources-source-map',
  output: {
    // 输出目录
    path: path.resolve(__dirname, "../dist"),
    // 文件名称
    filename: "bundle.js",
    chunkFilename: '[name].js'
  },
  plugins: [
    //开启HMR(热替换功能,替换更新部分,不重载页面！) 相当于在命令行加 --hot
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        VUEP_BASE_URL: JSON.stringify('/')
      }
    })
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, "../dist"),
    host: "localhost", // 可以使用手机访问
    port: 8081,
    historyApiFallback: true, //  该选项的作用所有的404都连接到index.html
    proxy: {
      '/api': {
        target: 'https://partner.ultradx.io/',
        // target: 'https://prepartner.wanfeng-dev.vip/',
        // target: 'http://192.168.50.63:9080',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/api' // 测试
          // '^/api': '' // 本地
          // 线上
        }
      },
      '/websocket/': {
        target: 'ws://101.37.33.73:8000', // 后台的websocket服务地址
        changeOrigin: false,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/websocket/': ''
        }
      },
    },
  }
});
