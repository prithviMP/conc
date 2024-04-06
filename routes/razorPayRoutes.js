const express = require('express');
const { getLeads } = require('../controllers/razorpayController');
const router = express.Router();

router.get('/leads', getLeads);

module.exports = router;