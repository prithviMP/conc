// routes/commentsRoutes.js

const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

// Fetch all comments for a post
router.get('/posts/:postId/comments', commentsController.getCommentsByPost);

// Add a new comment to a post
router.post('/posts/:postId/comments', commentsController.addComment);

module.exports = router;
