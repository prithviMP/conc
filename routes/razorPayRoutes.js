const express = require('express');
const { getLeads ,createOrder} = require('../controllers/razorpayController');
const router = express.Router();

//router.get('/leads', getLeads);
router.get('/create-order', createOrder);


module.exports = router;