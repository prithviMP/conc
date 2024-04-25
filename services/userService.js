const User = require('../models/userModel');

const userService = {
  createUser: async (userData) => {
    try {
      // Check if the user already exists
      let user = await User.findOne({
        where: { email: userData.email }
      });

      if (user) {
        // If user already exists, you might want to update some info or just return the user
        return user;
      } else {
        // Create new user
        user = await User.create(userData);
        return user;
      }
    } catch (error) {
      console.error('Error creating or finding user:', error);
      throw error;
    }
  },

  updateUserStatus: async (email, status) => {
    try {
      const user = await User.findOne({ where: { email: email } });
      if (user) {
        user.status = status;
        await user.save();
        return user;
      } else {
        // Log this as an anomaly if a user is not found
        const anomaly = new Error(`User with email ${email} not found.`);
        anomaly.type = 'UserNotFound';
        throw anomaly;
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },
  findOrCreateUser: async (userData) => {
    try {
      let user = await User.findOne({
        where: { email: userData.email }
      });
  
      if (!user) {
        user = await User.create(userData);
      }
      return user;
    } catch (error) {
      console.error('Error in finding or creating a user:', error);
      throw error;
    }
  },

  logAnomaly: async (anomaly) => {
    // Here you can implement logging to a file, sending to an error tracking service, etc.
    console.error('Anomaly detected:', anomaly);
    // Implement the logic to save the anomaly for a report
  }
};

module.exports = userService;
