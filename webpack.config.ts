// TODO: merge config
import Webpack from "webpack";
import Path from "path";
import Fs from "fs";
import CopyWebpackPlugin from "copy-webpack-plugin";

const injectScript = Fs.readFileSync("dist/utamita.js").toString();
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
        "content": Path.join(__dirname, "src/content.ts"),
        "eventpage": Path.join(__dirname, "src/eventpage.ts"),
    },
    output: {
        filename: "[name].js",
        path: Path.join(__dirname, "dist"),
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "public",
                },
            ],
        }),
        new Webpack.DefinePlugin({
            SCRIPT: JSON.stringify(injectScript),
        }),
    ],
    module: module
};

export default config;