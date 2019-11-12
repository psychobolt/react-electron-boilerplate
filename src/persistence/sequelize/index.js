import Sequelize from 'sequelize';

import config from './config';

const options = config[process.env.NODE_ENV];

export default new Sequelize(options);
