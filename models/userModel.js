module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // Model attributes
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true // Assuming city is not a mandatory field
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'abandoned_cart' // Default value as user is initially considered to have an abandoned cart
    }
  }, {
    // Model options
    tableName: 'users',
    timestamps: true // If you want Sequelize to automatically add createdAt and updatedAt
  });

  // Define any model associations here
  // User.associate = function(models) {
  //   User.hasMany(models.Comment, { foreignKey: 'userId' });
  //   User.hasMany(models.Post, { foreignKey: 'userId' });
  // };

  return User;
};
