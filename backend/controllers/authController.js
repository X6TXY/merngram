const User = require("../models/user");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploadToGCS } = require('../middleware/multer');


var refreshTokens = [];

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let profilePictureUrl = '';

    if (req.file) {
      try {
        profilePictureUrl = await uploadToGCS(req.file);
      } catch (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ error: 'Failed to upload profile picture' });
      }
    }

    const user = new User({
      username,
      password: hashedPassword,
      profilepicture: profilePictureUrl,
      creation_date: moment().format("MMMM Do YYYY, h:mm:ss a")
    });
    await user.save();
    res.status(200).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed!" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
  
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user._id }, 'your-refresh-secret-key', { expiresIn: '7d' });
    res.status(200).json({ token, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed!' });
  }
};




const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: "Refresh Token Required!" });
  }
  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ error: "Invalid Refresh Token!" });
  }
  try {
    const payload = jwt.verify(token, 'your-refresh-secret-key');
    const newToken = jwt.sign({ userId: payload.userId }, 'your-secret-key', { expiresIn: '1h' });
    res.status(200).json({ token: newToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Invalid Refresh Token!" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Failed to fetch users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};





module.exports = {
  login,
  register,
  refreshToken,
  getUsers
};
