const mongoose = require('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { post_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(post_id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const comment = new Comment({
      user: req.userId,
      content,
      post: post_id,
    });

    await comment.save();
    await Post.findByIdAndUpdate(post_id, { $push: { comments: comment._id } });

    res.status(200).json({ message: 'Comment added successfully!', comment });
  } catch (error) {
    console.error('Failed to add comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(post_id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const comments = await Comment.find({ post: post_id }).populate('user', 'username');
    res.status(200).json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const user = await User.findById(req.userId);
    if (comment.user.toString() !== req.userId && user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully!', comment });
  } catch (error) {
    console.error('Failed to update comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const user = await User.findById(req.userId);
    if (comment.user.toString() !== req.userId && user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await comment.deleteOne();
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: id } });

    res.status(200).json({ message: 'Comment deleted successfully!' });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};


module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
