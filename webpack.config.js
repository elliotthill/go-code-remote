const path = require("path");
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: "development",
    entry: './client/assets/js/index.js',
    output: {
        path: path.join(__dirname, 'client/dist'),
        publicPath: '/assets/dist',
        filename: 'bundle.js',
    },
    optimization: {
        usedExports: true,
        minimize: true
    },

    /*resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx']
    },*/
    devServer: {
        contentBase: './client/assets',
    },
    /*plugins: [
        new BundleAnalyzerPlugin()
    ]*/
};