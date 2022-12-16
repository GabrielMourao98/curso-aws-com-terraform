const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: "production",
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
    // devtool: 'inline-source-map',
      devServer: {
      static: './dist',
     hot: true,
    },
    plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: './src/index.html',
      scriptLoading: "blocking"
    }),
  ],
};