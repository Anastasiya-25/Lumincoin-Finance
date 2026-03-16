const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(woff|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/fontawesome/css/all.css", to: "css"},
                {from: "./src/static/fontawesome/webfonts", to: "webfonts"},
                {from: "./src/static/fonts", to: "fonts"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.css", to: "css"},
                // {from: "./node_modules/bootstrap/dist/js/bootstrap.js", to: "js"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.js", to: "js"},
                // {from: "./src/components/popper/popper.min.js", to: "js"},
                {from: "./src/static/images", to: "images"},

            ],
        }),
    ],
}
