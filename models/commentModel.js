// models/commentModel.js
const { DataTypes } = require('sequelize');
const db = require('../config/database'); // Adjust path if necessary

const Comment = db.sequelize.define('Comment', {
  text: DataTypes.STRING,
  postId: {
    type: DataTypes.INTEGER,
    references: { model: 'posts', key: 'id' } // Ensure 'posts' matches your Posts table name
  },
  userId: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' } // Ensure 'users' matches your Users table name
  }
}, {
  tableName: 'comments'
});

module.exports = Comment;
