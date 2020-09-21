import Webpack from "webpack";
import Path from "path";
import merge from "webpack-merge";
import common from "./webpack.common"

const config: Webpack.Configuration = merge(common, {
    entry: {
        "utamita": Path.join(__dirname, "src/utamita.ts"),
    }
});

export default config;