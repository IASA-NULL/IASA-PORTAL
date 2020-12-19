const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: './frontend/index.tsx',
    devtool: 'source-map',
    target: 'es5',
    output: {
        path: path.resolve(__dirname, 'static', 'js'),
        filename: 'main.js',
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader?modules=true', "sass-loader"],
                exclude: [
                    path.resolve('./node_modules/material-components-web'),
                    path.resolve('./node_modules/@material')
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader?modules=true'],
                exclude: [
                    path.resolve('./node_modules/material-components-web'),
                    path.resolve('./node_modules/@material')
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [
                    path.resolve('./node_modules/material-components-web'),
                    path.resolve('./node_modules/@material')
                ],
            }
        ],
    }, plugins: [
        new MiniCssExtractPlugin({filename: 'app.css'}),
    ],
}
