const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const baseWebpackConfig = require('./webpack.base.config.js')

const productionGzipExtensions = ['js', 'css']

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[name].[hash].js'
    },
    module: {
        rules: []
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh-cn|ko/),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 70000
        }),
        // new BundleAnalyzerPlugin()
    ],
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            chunks: "initial",
            minSize: 70000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '.',
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    reuseExistingChunk: true
                },
                tools: {
                    test: /[\\/]src[\\/]tools[\\/]/,
                    name: "tools"
                }
            }
        },
    },
    performance: {
        hints: false
    }
})

const CompressionWebpackPlugin = require('compression-webpack-plugin')

webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
            '\\.(' +
            productionGzipExtensions.join('|') +
            ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
    })
)


module.exports = webpackConfig
