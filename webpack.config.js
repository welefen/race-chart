const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    barRace: './src/bar/race/index.ts',
    barRank: './src/bar/rank/index.ts',
    lineRace: './src/line/race/index.ts',
    wordCloud: './src/cloud/word/index.ts'
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