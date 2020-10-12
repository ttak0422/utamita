import Webpack from "webpack";
import Path from "path";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

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

const optimization = (isProduction: boolean): Webpack.Options.Optimization => {
    return {
        minimizer:
            isProduction ? [
                new TerserPlugin({
                    terserOptions: {
                        compress: { drop_console: true }
                    }
                })
            ] : [],
    }
}

const config = (isProduction: boolean): Webpack.Configuration => {
    console.log();
    console.log(`isProduction ${isProduction}`);
    console.log();

    return {
        mode: "production",
        output,
        module,
        plugins,
        optimization: optimization(isProduction),
        resolve
    }
};

export default config;