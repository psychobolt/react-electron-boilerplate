import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import CommonConfig from './webpack.common';

const devMode = process.env.NODE_ENV !== 'production';

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  }
  if (m.name) {
    return m.name;
  }
  return false;
}

let config = {
  entry: {
    splash: ['css-hot-loader/hotModuleReplacement', './src/splash.js'],
    app: ['css-hot-loader/hotModuleReplacement', './src/index.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'src', '.build'),
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|ttf|otf|eot)$/,
        use: ['file-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        venderJS: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/].+\.js$/,
        },
        venderStyles: {
          name: 'vender',
          test: /[\\/]node_modules[\\/].+\.css$/,
          chunks: 'all',
          enforce: true,
        },
        splashStyles: {
          name: 'splash',
          test: (m, c, entry = 'splash') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
        appStyles: {
          name: 'app',
          test: (m, c, entry = 'app') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '*.html',
        'app.bundle.js',
        '*.app.bundle.js',
        'splash.bundle.js',
        '*.splash.bundle.js',
        '*.css',
      ],
    }),
  ],
};

const htmlConfigs = {
  splash: {
    filename: 'splash.html',
    template: 'src/splash.html',
    excludeChunks: ['app'],
  },
  app: {
    filename: 'index.html',
    template: 'src/index.html',
    excludeChunks: ['splash'],
  },
};

if (devMode) {
  config = merge(config, {
    devtool: 'eval-source-map',
    devServer: {
      host: 'localhost',
      port: 3000,
      hot: true,
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin(htmlConfigs.splash),
      new HtmlWebpackPlugin(htmlConfigs.app),
      new BundleAnalyzerPlugin(),
    ],
  });
} else {
  const htmlConfig = {
    minify: {
      collapseBooleanAttributes: true,
      decodeEntities: true,
      html5: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      sortAttributes: true,
      sortClassName: true,
      trimCustomFragments: true,
      useShortDoctype: true,
    },
  };
  config = merge(config, {
    plugins: [
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: { discardComments: { removeAll: true } },
      }),
      new HtmlWebpackPlugin({ ...htmlConfigs.splash, ...htmlConfig }),
      new HtmlWebpackPlugin({ ...htmlConfigs.app, ...htmlConfig }),
    ],
  });
}

export default merge(CommonConfig, config);
