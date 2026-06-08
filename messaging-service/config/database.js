// config/database.js
const { Sequelize } = require('sequelize');

// Set up Sequelize instance
const sequelize = new Sequelize('codevelop', 'postgres', '123', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;

