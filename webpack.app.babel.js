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

let config = {
  entry: ['react-hot-loader/patch', 'css-hot-loader/hotModuleReplacement', './src/index.js'],
  output: {
    filename: 'app.bundle.js',
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
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
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
        xelStyles: {
          name: 'xel.theme',
          test: /[\\/]node_modules[\\/]xel[\\/].+\.css$/,
          chunks: 'all',
          enforce: true,
        },
        venderStyles: {
          name: 'vender',
          test: /[\\/]node_modules[\\/](?!(xel[\\/])).+\.css/,
          chunks: 'all',
          enforce: true,
        },
        styles: {
          name: 'styles',
          test: /src[\\/].+\.css$/,
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
        '*.css',
        '*.woff',
        '*.woff2',
      ],
    }),
  ],
};

let htmlConfig = {
  filename: 'index.html',
  template: 'src/index.html',
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
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin(htmlConfig),
      new BundleAnalyzerPlugin(),
    ],
  });
} else {
  htmlConfig = {
    ...htmlConfig,
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
      new HtmlWebpackPlugin(htmlConfig),
    ],
  });
}

export default merge(CommonConfig, config);
