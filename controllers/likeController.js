// controllers/likeController.js

const Like = require('../models/likeModel');

exports.toggleLike = async (req, res) => {
  const { userId, postId } = req.body;
  
  try {
    // Check if the like already exists
    const existingLike = await Like.findOne({
      where: { userId, postId }
    });

    if (existingLike) {
      // If it exists, remove the like (unlike)
      await Like.destroy({
        where: { id: existingLike.id }
      });
      res.send({ message: "Post unliked successfully." });
    } else {
      // If not, create a new like
      const newLike = await Like.create({
        postId,
        userId
      });
      res.json(newLike);
    }
  } catch (error) {
    console.error("Error toggling the like on post: ", error);
    res.status(500).send({ message: "Error toggling like on post" });
  }
};

exports.getLikesByPost = async (req, res) => {
  const { postId } = req.params;
  
  try {
    const likes = await Like.count({
      where: { postId }
    });
    res.json({ postId, likes });
  } catch (error) {
    console.error("Error retrieving likes for post: ", error);
    res.status(500).send({ message: "Error retrieving likes" });
  }
};
