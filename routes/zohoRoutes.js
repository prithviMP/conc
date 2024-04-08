const express = require('express');
const { getLeads,captureLeadAndSendToZoho } = require('../controllers/zohoController');
const router = express.Router();

router.get('/leads', getLeads);
router.post('/capture', captureLeadAndSendToZoho);


module.exports = router;
