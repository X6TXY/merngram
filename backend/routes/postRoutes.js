const express = require('express');
const postController = require('../controllers/postController');
const verifyToken = require('../middleware/authMiddleware');
const postRouter = express.Router();

postRouter.route("/create-post").post(verifyToken, postController.createPost);
postRouter.route("/get-posts").get(postController.getPosts);
postRouter.route("/get-post/:id").get(postController.getPostById);
postRouter.route("/update-post/:id").put(verifyToken, postController.updatePost);
postRouter.route("/delete-post/:id").delete(verifyToken, postController.deletePost);
postRouter.route("/like-post/:id").post(verifyToken, postController.likePost);
postRouter.route("/unlike-post/:id").post(verifyToken, postController.unlikePost);

module.exports = postRouter;
