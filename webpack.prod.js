/* eslint-disable no-undef */
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

function modifyManifest(buffer) {
    const manifest = JSON.parse(buffer.toString())
    manifest.version = process.env.npm_package_version

    return JSON.stringify(manifest, null, 2)
}

module.exports = merge(common, {
    mode: 'production',

    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },

    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js',
        publicPath: '/',
        clean: true,
    },

    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: './public/manifest.json',
                    to: 'manifest.json',
                    transform: modifyManifest,
                },
                {
                    from: './public/icons/',
                    to: './icons/',
                },
            ],
        }),
    ],
})
