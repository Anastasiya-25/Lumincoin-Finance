const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.ts',
    mode: 'development',
    devtool: 'inline-source-map',
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
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                quietDeps: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
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
                //{from: "./node_modules/bootstrap/dist/js/bootstrap.js", to: "js"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.js", to: "js"},
                {from: "./src/components/popper/popper.min.js", to: "js"},
                {from: "./src/static/images", to: "images"},
                {from: "./node_modules/vanillajs-datepicker/dist/css/datepicker-bs5.min.css", to: "css"},
                {from: "./node_modules/vanillajs-datepicker/dist/js/datepicker.min.js", to: "js"},
                {from: "./node_modules/vanillajs-datepicker/dist/js/locales/ru.js", to: "js"},

            ],
        }),
    ],
}
