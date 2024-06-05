const mongoose = require('mongoose');
const User = require("../models/user");
const { uploadToGCS } = require('../middleware/multer');

const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const loggedInUser = await User.findById(req.userId);
      if (loggedInUser.role !== 'admin' && loggedInUser._id.toString() !== user._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      if (username) user.username = username;
      if (password) user.password = await bcrypt.hash(password, 10);
  
      if (req.file) {
        try {
          user.profilepicture = await uploadToGCS(req.file);
        } catch (err) {
          console.error('Error uploading file:', err);
          return res.status(500).json({ error: 'Failed to upload profile picture' });
        }
      }
  
      await user.save();
      res.status(200).json({ message: 'User updated successfully!', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'User update failed!' });
    }
  };


module.exports ={
    updateUser
}