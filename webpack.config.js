const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = (env, argv) => ({
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.(ttf|woff2?|wav)$/i,
        type: 'asset/inline',
      },
      {
        test: /(\.css)$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: 'head',
              injectType: 'singletonStyleTag',
            },
          },
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    ...[argv.mode === 'production' ? new HtmlInlineScriptPlugin() : []].flat(),
  ],
  devServer: {
    static: './dist',
  },
});
