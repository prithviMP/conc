// models/likeModel.js

module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
      postId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    });
  
    Like.associate = function(models) {
      // associations can be defined here
      Like.belongsTo(models.User, { foreignKey: 'userId' });
      Like.belongsTo(models.Post, { foreignKey: 'postId' });
    };
  
    return Like;
  };
  