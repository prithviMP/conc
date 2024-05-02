// controllers/commentsController.js

const Comment = require('../models/commentModel')

exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { postId }
    });
    res.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    res.status(500).send('Failed to fetch comments');
  }
};

exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { userId, text } = req.body; // Assume a userId is passed along with text
  try {
    const comment = await Comment.create({
      text,
      postId,
      userId
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Failed to add comment:', error);
    res.status(500).send('Failed to add comment');
  }
};
