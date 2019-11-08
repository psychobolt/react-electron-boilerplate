import path from 'path';
import merge from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import CommonConfig from './webpack.common';

const config = {
  entry: ['./src/server.js'],
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, 'src', '.build'),
    hotUpdateMainFilename: 'server.[hash].hot-update.json',
  },
  node: {
    __dirname: true,
  },
  target: 'node',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.gql$/,
        loader: 'webpack-graphql-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        'server.bundle.js',
        '*.server.bundle.js',
        'server.*.hot-update.json',
        'server.*.hot-update.js',
      ],
    }),
  ],
};

export default merge(CommonConfig, config);
