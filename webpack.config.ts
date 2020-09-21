import Webpack from "webpack";
import Path from "path";

const rules: Webpack.RuleSetRule[] = [
    {
        test: /\.ts$/,
        use: "ts-loader",
    }
]

const module: Webpack.Module = {
    rules: rules
};

const config: Webpack.Configuration = {
    entry: {
        "main": Path.join(__dirname, "src/main.ts"),
    },
    output: {
        filename: "[name].js",
        path: Path.join(__dirname, "dist"),
    },
    plugins: [
    ],
    module: module
};

export default config;