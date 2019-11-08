require('@babel/register')({
  cache: false,
  plugins: [
    'inline-json-import',
  ],
});

const path = require('path');

const workingDir = path.resolve('src', 'persistence', 'sequelize');

module.exports = {
  config: path.resolve(workingDir, 'config', 'config.js'),
  'models-path': path.resolve(workingDir, 'models'),
  'migrations-path': path.resolve(workingDir, 'migrations'),
  'seeders-path': path.resolve(workingDir, 'seeders'),
};
