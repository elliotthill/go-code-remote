import webpack from 'webpack';

import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
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