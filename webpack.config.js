const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = (env, argv) => {
    const devMode = argv.mode === 'development'

    return [
        {
            entry: './backend/index.ts',
            devtool: 'source-map',
            target: 'node',
            output: {
                path: path.resolve(__dirname, 'build'),
                filename: 'index.js',
            },
            resolve: {
                extensions: ['.ts'],
            },
            externals: [nodeExternals()],
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        loader: 'ts-loader',
                    },
                ],
            },
            plugins: [
                new webpack.DefinePlugin({
                    DEV_MODE: devMode,
                }),
            ],
        },
        {
            entry: {
                main: './frontend/index.tsx',
                auth: './frontend/auth.tsx',
                app: './frontend/app/index.tsx',
            },
            ...(devMode && { devtool: 'source-map' }),
            target: 'es6',
            output: {
                path: path.resolve(__dirname, 'static', 'js'),
                filename: '[name].js',
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
                fallback: {
                    stream: require.resolve('stream-browserify'),
                },
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        loader: 'ts-loader',
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            'style-loader',
                            'css-loader?modules=true',
                            'sass-loader',
                        ],
                        exclude: [
                            path.resolve(
                                './node_modules/material-components-web'
                            ),
                            path.resolve('./node_modules/@material'),
                        ],
                    },
                    {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader?modules=true'],
                        exclude: [
                            path.resolve(
                                './node_modules/material-components-web'
                            ),
                            path.resolve('./node_modules/@material'),
                        ],
                    },
                    {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader'],
                        include: [
                            path.resolve(
                                './node_modules/material-components-web'
                            ),
                            path.resolve('./node_modules/@material'),
                        ],
                    },
                ],
            },
            plugins: [
                new MiniCssExtractPlugin({ filename: 'app.css' }),
                new webpack.DefinePlugin({
                    DEV_MODE: devMode,
                }),
            ],
        },
    ]
}
