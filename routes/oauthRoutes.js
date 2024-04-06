// routes/oauthRoutes.js

const express = require('express');
const { refreshTokenIfNeeded } = require('../controllers/oauthController'); // Adjust the path as necessary

const router = express.Router();

router.get('/protected-resource', refreshTokenIfNeeded, async (req, res) => {
  // You can access the refreshed token via req.token
  // Make your API call using the access token

  res.send('Accessing protected resource');
});

module.exports = router;
