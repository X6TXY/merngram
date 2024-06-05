const express = require("express");
const profileController = require("../controllers/profileController");
const verifyToken = require("../middleware/authMiddleware");
const { upload } = require('../middleware/multer');

const profileRouter = express.Router();

profileRouter.route('/user/:id').put(verifyToken, upload.single('profilepicture'), profileController.updateUser);

module.exports = profileRouter;