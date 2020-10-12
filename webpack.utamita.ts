import Webpack from "webpack";
import Path from "path";
import merge from "webpack-merge";
import common from "./webpack.common"

module.exports = (env: any) => merge(common(env?.isProduction === "true"), {
    entry: {
        "utamita": Path.join(__dirname, "src/utamita.ts"),
    }
});