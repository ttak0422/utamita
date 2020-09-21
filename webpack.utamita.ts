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
        "utamita": Path.join(__dirname, "src/utamita.ts"),
    },
    output: {
        filename: "[name].js",
        path: Path.join(__dirname, "dist"),
    },
    module: module
};

export default config;