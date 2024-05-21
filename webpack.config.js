var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var CONFIG = {
    indexHtmlTemplate: './index.html',
    outputDir: './deploy',
    assetsDir: './public',
    publicPath: '/',
    devServerPort: 8080
}

module.exports = {
    output: {
        publicPath: CONFIG.publicPath,
        path: resolve(CONFIG.outputDir),
        filename: '[name].js',
    },
    mode: 'development',
    devtool: 'eval-source-map',
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: 'single'
    },

    experiments: {
        asyncWebAssembly: true,
        topLevelAwait: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(CONFIG.indexHtmlTemplate)
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: resolve(CONFIG.assetsDir) }]
        })
    ],

    resolve: {
        // See https://github.com/fable-compiler/Fable/issues/1490
        // symlinks: false,
        // See https://github.com/cornerstonejs/cornerstone3D/issues/1071 (similar issue)
        alias: {
            "@cornerstonejs/core": "@cornerstonejs/core/dist/umd/index.js",
            "@cornerstonejs/tools": "@cornerstonejs/tools/dist/umd/index.js",
        }
    },

    devServer: {
        historyApiFallback: {
            index: '/'
        },
        static: {
            directory: resolve(CONFIG.assetsDir)
        },
        host: '0.0.0.0',
        port: CONFIG.devServerPort,
        hot: true,
        server: 'https'
    }
};

function resolve(filePath) {
    return path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);
}
