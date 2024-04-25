const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database.sqlite', // Update the path as needed
  logging: false // You can set it to console.log for debugging purposes
});

module.exports = sequelize;
