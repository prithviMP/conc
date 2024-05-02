const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false  // Set true to enable logging SQL queries
});

const db = {
  sequelize,
  Sequelize
};

// Function to setup models and associations
async function setupModels() {
  // Import and initialize models
  db.User = require('../models/userModel')(sequelize, DataTypes);
  db.Post = require('../models/postModel')(sequelize, DataTypes);
  db.Comment = require('../models/commentModel')(sequelize, DataTypes);

  // Setup associations
  db.User.hasMany(db.Comment, { foreignKey: 'userId' });
  db.Post.hasMany(db.Comment, { foreignKey: 'postId' });
  db.Comment.belongsTo(db.User, { foreignKey: 'userId' });
  db.Comment.belongsTo(db.Post, { foreignKey: 'postId' });

  // Synchronize all models with the database
  await db.sequelize.sync({ force: true });  // Use { force: true } cautiously as it will drop existing tables
  console.log('Models are synchronized and ready to use.');
}

// Export db and setup function
module.exports = { db, setupModels };
