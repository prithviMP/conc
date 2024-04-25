const axiosZoho = require('../config/axiosRazorpay');
const Razorpay = require('razorpay');
const userService = require('../services/userService');



// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  
  exports.createOrder = async (req, res) => {
    const { amount, currency = 'INR', receipt, notes } = req.body;
  
    try {
      const options = {
        amount: 100, // Razorpay expects the amount in the smallest currency unit (e.g., paise for INR)
        currency,
        receipt,
        notes,
      };
  
      const order = await razorpay.orders.create(options);
  
      res.json(order);
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).send('Unable to create order');
    }
  };