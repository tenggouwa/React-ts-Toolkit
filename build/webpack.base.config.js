const path = require("path");

const webpack = require("webpack");
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const devMode = process.env.NODE_ENV !== "production";


const minCssLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    publicPath: '../',
    esModule: false,
    hmr: devMode,
    reloadAll: true,
  },
}

const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
      filename: "index.html", // 最终创建的文件名
      template: path.resolve(__dirname, '..', "src/template.html"), // 指定模板路径
      minify: {
          collapseWhitespace: true // 去除空白
      },
      favicon: path.resolve(__dirname, '..', 'favicon.ico'),
  }),
  // happypack
  new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      //如何处理  用法和loader 的配置一样
      loaders: [{
          loader: 'babel-loader?cacheDirectory=true',
      }],
      //共享进程池threadPool: HappyThreadPool 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true,
  }),
  // css单独提取
  new MiniCssExtractPlugin({
      // filename: "css/[name].[contenthash].css",
      // chunkFilename: "css/[id].[contenthash].css",
      filename: devMode ? "css/[name].css" : "css/[name].[contenthash].css",
      chunkFilename: devMode ? "css/[id].css" : "css/[id].[contenthash].css",
      ignoreOrder: true,
  }),
  new FriendlyErrorsWebpackPlugin(),
  new WebpackBar(),
];
if (devMode) {
  // only enable hot in development
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
    entry: ["./src/index.tsx"],
    output: {
        // 输出目录
        path: path.resolve(__dirname, "../dist")
    },
    externals: {
        baseURL: 'baseURL',
        _hmt: '_hmt'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
            "@": path.resolve(__dirname, "../src"),
            pages: path.resolve(__dirname, "../src/pages"),
            router: path.resolve(__dirname, "../src/router")
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: "happypack/loader?id=happyBabel",
                },
                {
                  loader: "babel-loader",
                  options: {
                    presets: [
                      "@babel/preset-env"
                    ],
                    plugins: [
                      "@babel/plugin-transform-runtime",
                      "@babel/plugin-transform-async-to-generator",
                      "@babel/plugin-proposal-class-properties",
                      [
                        'babel-plugin-import',
                        {
                          libraryName: '@arco-design/web-react',
                          libraryDirectory: 'es',
                          camel2DashComponentName: false,
                          style: true, // 样式按需加载
                        },
                      ],
                    ]
                  }
                }
              ]
            },
            {
              test: /\.css$/,
              use: [
                minCssLoader,
                "css-loader", // 编译css
                "sass-loader", // 编译scss
                "less-loader",
              ],
            },
            {
              test: /\.(sc|sa)ss$/,
              use: [
                minCssLoader,
                "css-loader", // 编译css
                "sass-loader" // 编译scss
              ],
            },
            {
                test: /\.less$/,
                use: [
                    minCssLoader,
                    "css-loader", // 编译css
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                modifyVars: { '@primary-color': '#1DA57A' },
                                javascriptEnabled: true,
                            },
                        }
                    }
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: "url-loader",
                    options: {
                        outputPath: "./images/", // 图片输出的路径
                        limit: 10 * 1024
                    }
                }
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:5].min.[ext]',
                            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
                            publicPath: 'fonts/',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    stats: {
      children: false,
    },
    plugins,
    performance: false // 关闭性能提示
};