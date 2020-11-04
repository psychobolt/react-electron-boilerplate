import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

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
    splash: ['./src/splash.js'],
    app: ['./src/index.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'src', '.build'),
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\xel.min.js$/,
        use: ['babel-loader'],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode,
            },
          },
          'css-loader',
          'sass-loader',
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
          chunks: 'all',
          enforce: true,
        },
        venderStyles: {
          name: 'vender.style',
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
    moduleIds: 'named',
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
        'vender.bundle.js',
        'vender.style.bundle.js',
        '*.css',
        '*.woff',
        '*.woff2',
      ],
    }),
  ],
};

const htmlConfigs = {
  splash: {
    filename: 'splash.html',
    template: 'src/splash.html',
    chunks: ['vender', 'vender.style', 'splash'],
  },
  app: {
    filename: 'index.html',
    template: 'src/index.html',
    chunks: ['vender', 'vender.style', 'app'],
  },
};

if (devMode) {
  config = merge(config, {
    devtool: 'eval-source-map',
    devServer: {
      host: 'localhost',
      port: 3000,
      hot: true,
      historyApiFallback: true,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin(htmlConfigs.splash),
      new HtmlWebpackPlugin(htmlConfigs.app),
      new BundleAnalyzerPlugin(),
      new ReactRefreshPlugin({ disableRefreshCheck: true }),
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
