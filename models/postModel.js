module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      // Model attributes
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      // Model options
      tableName: 'posts',
      timestamps: true // To automatically handle createdAt and updatedAt
    });
  
    // Define any model associations here
    Post.associate = function(models) {
      // Assuming Post has a foreign key userId
      Post.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
      // Assuming one post can have many comments
      Post.hasMany(models.Comment, { foreignKey: 'postId' });
    };
  
    return Post;
  };
  