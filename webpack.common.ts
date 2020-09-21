import Webpack from "webpack";
import Path from "path";

const module: Webpack.Module = {
    rules: [
        {
            test: /\.ts$/,
            use: "ts-loader",
        }
    ],
};

const output: Webpack.Output = {
    filename: "[name].js",
    path: Path.join(__dirname, "dist"),
}

const config: Webpack.Configuration = {
    output,
    module
};

export default config;