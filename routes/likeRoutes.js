// routes/likeRoutes.js

const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// Toggle like on a post
router.post('/likes/toggle', likeController.toggleLike);

// Get all likes for a specific post
router.get('/likes/:postId', likeController.getLikesByPost);

module.exports = router;
