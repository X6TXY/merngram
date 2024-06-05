const express = require("express");
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const { upload } = require('../middleware/multer');

const authRouter = express.Router();

authRouter.route("/login").post(authController.login);
authRouter.route("/register").post(upload.single('profilepicture'), authController.register);
authRouter.route("/refresh-token").post(authController.refreshToken);
authRouter.route("/users").get(authController.getUsers);


authRouter.route("/userdata").get(verifyToken, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = authRouter;
