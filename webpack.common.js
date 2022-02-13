/* eslint-disable no-undef */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProvidePlugin = require('webpack/lib/ProvidePlugin')

module.exports = {
    entry: './src/index.js',
    target: 'web',

    resolve: {
        extensions: ['.js', '.json'],
        modules: [path.join(__dirname, './src'), 'node_modules'],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.s?css$/,
                oneOf: [
                    {
                        test: /\.module\.s?css$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: {
                                        localIdentName:
                                            '[name]_[local]_[hash:base64]',
                                    },
                                },
                            },
                            'sass-loader',
                        ],
                    },
                    {
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            'sass-loader',
                        ],
                    },
                ],
            },

            {
                test: /\.(png|jpe?g|gif|webp)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[contenthash].[ext]',
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.ejs',
            templateParameters: {
                PUBLIC_URL: '/public/',
            },
        }),
        new MiniCssExtractPlugin(),
        new ProvidePlugin({
            React: 'react',
            PropTypes: 'prop-types',
            classnames: 'classnames',
        }),
    ],
}
