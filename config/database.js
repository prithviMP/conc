const { Sequelize } = require('sequelize');

// Setup the Sequelize instance
const sequelize =  new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Update the path as needed
  logging: false // You can set it to console.log for debugging purposes
});

const db = {
  sequelize, // This represents your sequelize instance
  Sequelize // This exports the Sequelize library itself
};


// Import models
db.User = require('../models/userModel')(sequelize, Sequelize);
db.Post = require('../models/postModel')(sequelize, Sequelize);
db.Comment = require('../models/commentModel')(sequelize, Sequelize);

// Setup associations
db.User.hasMany(db.Comment, { foreignKey: 'userId' });
db.Post.hasMany(db.Comment, { foreignKey: 'postId' });
db.Comment.belongsTo(db.User, { foreignKey: 'userId' });
db.Comment.belongsTo(db.Post, { foreignKey: 'postId' });

console.log(db);
module.exports = db;
