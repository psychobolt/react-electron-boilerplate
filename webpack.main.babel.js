import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import CommonConfig from './webpack.common';

const isDev = process.env.NODE_ENV === 'development' ? 'true' : 'false';

let config = {
  entry: ['./src/main.js'],
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'src', '.build'),
    hotUpdateMainFilename: 'main.[hash].hot-update.json',
  },
  node: {
    __dirname: false,
  },
  target: 'electron-main',
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        'main.bundle.js',
        '*.main.bundle.js',
        'main.*.hot-update.json',
        'main.*.hot-update.js',
      ],
    }),
    new webpack.EnvironmentPlugin({
      SKIP_SPLASH: process.env.SKIP_SPLASH || 'false',
      DEBUG_MAIN: process.env.DEBUG_MAIN || isDev,
    }),
  ],
};

if (isDev) {
  config = merge(config, {
    devtool: 'inline-source-map',
    plugins: [
      new webpack.IgnorePlugin(/.\/server$/),
    ],
  });
} else {
  config = merge(config, {
    node: {
      __dirname: false,
    },
  });
}

export default merge(CommonConfig, config);
