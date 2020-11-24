import path from 'path';
import merge from 'webpack-merge';

const isDevMode = process.env.NODE_ENV === 'development';

let config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [process.env.BABEL_ENV === 'renderer' && isDevMode && ['react-refresh/babel', { skipEnvCheck: true }]].filter(Boolean),
            },
          },
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

if (isDevMode) {
  config = merge(config, {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/(@apollographql\/graphql-playground-html|graphql-tools|graphql-subscriptions|deprecated-decorator|subscriptions-transport-ws|@apollo\/client)/,
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
