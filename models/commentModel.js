// models/commentModel.js
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: DataTypes.STRING,
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'posts',  // This is the table name
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',  // This is the table name
        key: 'id'
      }
    }
  }, {
    tableName: 'comments'
  });

  return Comment;
};
