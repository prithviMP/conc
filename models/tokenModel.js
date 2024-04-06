// models/tokenModel.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path as necessary

class Token extends Model {}

Token.init({
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresIn: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Token',
});

module.exports = Token;
