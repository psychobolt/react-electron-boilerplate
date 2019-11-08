import path from 'path';
import merge from 'webpack-merge';

let config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  resolve: {
    alias: {
      sqlite3: path.resolve('src', 'node_modules', 'sqlite3'),
    },
  },
  externals: {
    worker_threads: 'worker_threads',
    'apollo-server': 'commonjs apollo-server',
    'apollo-server-express': 'commonjs apollo-server-express',
    express: 'commonjs express',
    sqlite3: 'commonjs sqlite3',
    sequelize: 'commonjs sequelize',
    umzug: 'commonjs umzug',
  },
};

if (process.env.NODE_ENV === 'development') {
  config = merge(config, {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/(@apollographql\/graphql-playground-html|graphql-tools|graphql-subscriptions|deprecated-decorator|subscriptions-transport-ws)/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
      ],
    },
  });
} else {
  config = merge(config, {
    mode: 'production',
  });
}

const commonConfig = config;
export default commonConfig;
