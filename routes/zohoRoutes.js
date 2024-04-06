const express = require('express');
const { getLeads } = require('../controllers/zohoController');
const router = express.Router();

router.get('/leads', getLeads);

module.exports = router;
