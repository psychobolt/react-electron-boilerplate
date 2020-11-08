import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import CommonConfig from './webpack.common';

const isDev = process.env.NODE_ENV === 'development';

let config = {
  entry: ['./src/main.js'],
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'src', '.build'),
  },
  node: {
    __dirname: true,
  },
  target: 'electron-main',
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['main.bundle.js'],
    }),
    new webpack.EnvironmentPlugin({
      SKIP_SPLASH: process.env.SKIP_SPLASH || false,
      DEBUG_MAIN: process.env.DEBUG_MAIN || isDev,
    }),
  ],
  externals: {
    worker_threads: 'worker_threads',
  },
};

if (isDev) {
  config = merge(config, {
    devtool: 'inline-source-map',
  });
} else {
  config = merge(config, {
    node: {
      __dirname: false,
    },
  });
}

export default merge(CommonConfig, config);
