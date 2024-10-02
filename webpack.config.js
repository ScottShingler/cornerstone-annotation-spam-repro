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

    experiments: {
        asyncWebAssembly: true,
        topLevelAwait: true,
    },

    plugins: [
        new webpack.DefinePlugin({
            __BASE_PATH__: "''",
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(CONFIG.indexHtmlTemplate)
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: resolve(CONFIG.assetsDir) },
                {
                    from: path.join(__dirname, 'node_modules', '@cornerstonejs/dicom-image-loader', 'dist/dynamic-import')
                },
            ]
        })
    ],

    resolve: {
        alias: {
            '@cornerstonejs/dicom-image-loader': '@cornerstonejs/dicom-image-loader/dist/dynamic-import/cornerstoneDICOMImageLoader.min.js',
        }
    },

    devServer: {
        webSocketServer: false,
        static: {
            directory: resolve(CONFIG.assetsDir)
        },
        host: '0.0.0.0',
        port: CONFIG.devServerPort,
        hot: true,
        server: 'https',
        historyApiFallback: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },

    module: {
        rules: [
            {
                test: /\.wasm$/,
                type: 'asset/resource',
            }
        ],
    },
};

function resolve(filePath) {
    return path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);
}
