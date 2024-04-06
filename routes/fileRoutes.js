// routes/fileRoutes.js

const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/download', (req, res) => {
  const filePath = path.join(__dirname, '../files/yourfile.pdf'); // Adjust the path and file name as necessary
  res.sendFile(filePath, err => {
    if (err) {
      // Handle error, but ensure header is not already sent
      if (!res.headersSent) {
        res.status(500).send('Error sending file');
      }
    }
  });
});

module.exports = router;
