const express = require('express');
const commentController = require('../controllers/commentController');
const verifyToken = require('../middleware/authMiddleware');
const commentRouter = express.Router();

commentRouter.route('/create-comment/:post_id').post(verifyToken, commentController.createComment);
commentRouter.route('/get-comments/:post_id').get(commentController.getCommentsByPost);
commentRouter.route('/update-comment/:id').put(verifyToken, commentController.updateComment);
commentRouter.route('/delete-comment/:id').delete(verifyToken, commentController.deleteComment);

module.exports = commentRouter;
