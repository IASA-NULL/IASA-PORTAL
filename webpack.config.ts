import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import nodeExternals from 'webpack-node-externals'
import webpack from 'webpack'
import { pages } from './webpack/loader'
import { Permission } from './scheme/api/auth'

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

export default (env: any, argv: any) => {
    const devMode = argv.mode === 'development'

    let template_pages = pages()

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
                        loader: 'babel-loader',
                    },
                    {
                        test: /\.tsx?$/,
                        loader: 'string-replace-loader',
                        options: {
                            search: '//RENDER_DRAWER_ADMIN//',
                            replace: template_pages.drawer[Permission.admin],
                        },
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
                filename: '[name].[contenthash:8].js',
                publicPath: './static/js/',
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
                fallback: {
                    stream: require.resolve('stream-browserify'),
                    domain: false,
                },
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        loader: 'babel-loader',
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
                    {
                        test: /\.tsx?$/,
                        loader: 'string-replace-loader',
                        options: {
                            multiple: [
                                {
                                    search: '//RENDER_DRAWER_ADMIN//',
                                    replace:
                                        template_pages.drawer[Permission.admin],
                                },
                                {
                                    search: '//RENDER_DRAWER_TEACHER//',
                                    replace:
                                        template_pages.drawer[
                                            Permission.teacher
                                        ],
                                },
                                {
                                    search: '//RENDER_DRAWER_STUDENT//',
                                    replace:
                                        template_pages.drawer[
                                            Permission.student
                                        ],
                                },
                                {
                                    search: '//RENDER_COMPONENT_IMPORTS//',
                                    replace: template_pages.imports,
                                },
                                {
                                    search: '//RENDER_ROUTER_STUDENT//',
                                    replace:
                                        template_pages.router[
                                            Permission.student
                                        ],
                                },
                                {
                                    search: '//RENDER_ROUTER_TEACHER//',
                                    replace:
                                        template_pages.router[
                                            Permission.teacher
                                        ],
                                },
                                {
                                    search: '//RENDER_ROUTER_ADMIN//',
                                    replace:
                                        template_pages.router[Permission.admin],
                                },
                                {
                                    search: '//RENDER_ROUTER_NONE//',
                                    replace:
                                        template_pages.router[Permission.none],
                                },
                            ],
                        },
                    },
                ],
            },
            plugins: [
                new MiniCssExtractPlugin({ filename: 'app.css' }),
                new HtmlWebpackPlugin({
                    template: './template/main.html',
                    filename: '../html/main.html',
                    chunks: ['main'],
                }),
                new HtmlWebpackPlugin({
                    template: './template/auth.html',
                    filename: '../html/auth.html',
                    chunks: ['auth'],
                }),
                new HtmlWebpackPlugin({
                    template: './template/app.html',
                    filename: '../html/app.html',
                    chunks: ['app'],
                }),
                new CleanWebpackPlugin(),
                new webpack.DefinePlugin({
                    DEV_MODE: devMode,
                }),
            ],
        },
    ]
}
