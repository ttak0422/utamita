import { Configuration } from "webpack";
import Path from "path";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const optimization = (isProduction: boolean) => {
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

const config = (isProduction: boolean): Configuration => {
  console.log();
  console.log(`isProduction ${isProduction}`);
  console.log();

  return {
    mode: "production",
    output: {
      filename: "[name].js",
      path: Path.join(__dirname, "dist"),
    },
    module: {
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
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/styles.css'
      }),
    ],
    optimization: optimization(isProduction),
    resolve: {
      extensions: [
        ".ts", ".js"
      ],
    }
  }
};

export default config;
