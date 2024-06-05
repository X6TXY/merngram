const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required!' });
    }

    const post = new Post({
      user: req.userId,
      title,
      content,
    });
    await post.save();
    res.status(201).json({ message: 'Post created successfully!', post });
  } catch (err) {
    res.status(500).json({ error: 'Post creation failed!' });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    const post = await Post.findById(id)
      .populate('user', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' }
      })
      .populate('likedBy', 'username'); // Populate likedBy with usernames
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error('Failed to fetch post:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};


// Get posts with pagination and search
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 9, sortBy = 'createdAt', order = 'desc', search = '' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { [sortBy]: order === 'desc' ? -1 : 1 }
    };

    const searchQuery = search ? {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const posts = await Post.find(searchQuery)
      .populate('user', 'username')
      .sort(options.sort)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const totalPosts = await Post.countDocuments(searchQuery);

    res.status(200).json({
      totalPosts,
      totalPages: Math.ceil(totalPosts / options.limit),
      currentPage: options.page,
      posts
    });
  } catch (err) {
    console.error('Failed to fetch posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'admin' && post.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();

    res.status(200).json({ message: 'Post updated successfully!', post });
  } catch (err) {
    console.error('Failed to update post:', err);
    res.status(500).json({ error: 'Post update failed!' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'admin' && post.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (err) {
    console.error('Failed to delete post:', err);
    res.status(500).json({ error: 'Post deletion failed!' });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await Post.findById(id).populate('likedBy', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.likedBy.some(user => user._id.toString() === req.userId)) {
      return res.status(400).json({ error: 'You have already liked this post' });
    }

    post.likes += 1;
    post.likedBy.push(req.userId);
    await post.save();
    await post.populate('likedBy', 'username').execPopulate();

    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like post' });
  }
};

const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await Post.findById(id).populate('likedBy', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.likedBy.some(user => user._id.toString() === req.userId)) {
      return res.status(400).json({ error: 'You have not liked this post' });
    }

    post.likes -= 1;
    post.likedBy = post.likedBy.filter(user => user._id.toString() !== req.userId);
    await post.save();
    await post.populate('likedBy', 'username').execPopulate();

    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unlike post' });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost
};
