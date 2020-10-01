import Webpack from "webpack";
import Path from "path";
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const module: Webpack.Module = {
    rules: [
        {
            test: /\.tsx?$/,
            use: "ts-loader",
        },
        {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'sass-loader',
                }
            ]
        }
    ],

};

const plugins: Webpack.Plugin[] = [
    new MiniCssExtractPlugin({
        filename: 'css/styles.css'
      }),
]

const output: Webpack.Output = {
    filename: "[name].js",
    path: Path.join(__dirname, "dist"),
}

const resolve: Webpack.Resolve = {
    extensions: [
        ".ts", ".js"
    ],
}

const config: Webpack.Configuration = {
    output,
    module,
    plugins,
    resolve
};

export default config;