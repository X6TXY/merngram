const express = require("express");
const authRouter = require("./authRoutes");
const postRouter = require("./postRoutes");
const commentRouter = require('./commentRoutes');
const profileRouter = require("./profileRoutes");


const router = express.Router();

router.use("/auth", authRouter);
router.use("/posts", postRouter);
router.use('/comments', commentRouter);
router.use('/profile', profileRouter);

module.exports = router;
