const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    barRace: './src/bar/race/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
  externals: {
    spritejs: 'spritejs',
    '@tweenjs/tween.js': 'TWEEN'
  }
};