import Webpack from "webpack";
import Path from "path";
import Fs from "fs";
import CopyWebpackPlugin from "copy-webpack-plugin";
import merge from "webpack-merge";
import common from "./webpack.common";

const injectScript = Fs.readFileSync("dist/utamita.js").toString();

module.exports = (env: any) => merge(common(env?.isProduction === "true"), {
    entry: {
        "content": Path.join(__dirname, "src/content.ts"),
        "eventpage": Path.join(__dirname, "src/eventpage.ts"),
        "popup": Path.join(__dirname, "src/popup.tsx"),
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
});