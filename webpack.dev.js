/* eslint-disable no-undef */

const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')

module.exports = merge(common, {
    mode: 'development',

    devtool: 'cheap-module-source-map',

    devServer: {
        host: '0.0.0.0',
        port: 3000,
        https: false,

        historyApiFallback: true,

        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                secure: false,
            },
        },
    },

    plugins: [new ErrorOverlayPlugin()],
})
