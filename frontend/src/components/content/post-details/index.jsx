import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import { Footer } from "../../partials/footer";
import { Heading } from "../../partials/heading";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "./style.css";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [editCommentContent, setEditCommentContent] = useState({});
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [open, setOpen] = useState(false);
  const [likedBy, setLikedBy] = useState([]);
  const { isAuthenticated, userData } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/posts/get-post/${id}`)
      .then((response) => {
        setPost(response.data);
        setLikedBy(response.data.likedBy);
        setEditPostContent(response.data.content);
      })
      .catch((error) => {
        console.error("Failed to fetch post:", error);
      });

    axios
      .get(`http://localhost:8000/api/comments/get-comments/${id}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch comments:", error);
      });
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    axios
      .post(
        `http://localhost:8000/api/comments/create-comment/${id}`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setComments([...comments, response.data.comment]);
        setNewComment("");
      })
      .catch((error) => {
        console.error("Failed to create comment:", error);
      });
  };

  const handleLike = () => {
    axios
      .post(
        `http://localhost:8000/api/posts/like-post/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setPost(response.data.post);
        setLikedBy(response.data.post.likedBy);
      })
      .catch((error) => {
        console.error("Failed to like post:", error);
      });
  };

  const handleUnlike = () => {
    axios
      .post(
        `http://localhost:8000/api/posts/unlike-post/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setPost(response.data.post);
        setLikedBy(response.data.post.likedBy);
      })
      .catch((error) => {
        console.error("Failed to unlike post:", error);
      });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeletePost = () => {
    axios
      .delete(`http://localhost:8000/api/posts/delete-post/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to delete post:", error);
      });
  };

  const handleDeleteComment = (commentId) => {
    axios
      .delete(
        `http://localhost:8000/api/comments/delete-comment/${commentId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        setComments(comments.filter((comment) => comment._id !== commentId));
      })
      .catch((error) => {
        console.error("Failed to delete comment:", error);
      });
  };

  const handleEditPost = () => {
    setIsEditingPost(true);
  };

  const handleSavePost = () => {
    axios
      .put(
        `http://localhost:8000/api/posts/update-post/${id}`,
        { content: editPostContent },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setPost(response.data.post);
        setIsEditingPost(false);
      })
      .catch((error) => {
        console.error("Failed to update post:", error);
      });
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditCommentContent({ ...editCommentContent, [commentId]: content });
  };

  const handleSaveComment = (commentId) => {
    axios
      .put(
        `http://localhost:8000/api/comments/update-comment/${commentId}`,
        { content: editCommentContent[commentId] },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setComments(
          comments.map((comment) =>
            comment._id === commentId ? response.data.comment : comment
          )
        );
        setEditingCommentId(null);
      })
      .catch((error) => {
        console.error("Failed to update comment:", error);
      });
  };

  if (!post) {
    return (
      <Container>
        <Typography variant="h5" component="h2" gutterBottom>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <div>
      <Heading />
      <Container className="mt-10 mb-10">
        <Card className="post-card">
          <CardHeader
            title={post.title}
            subheader={`Author: ${post.user.username}`}
            action={
              isAuthenticated &&
              userData &&
              (userData.role === "admin" || userData._id === post.user._id) && (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleEditPost}
                  >
                    Edit Post
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDeletePost}
                  >
                    Delete Post
                  </Button>
                </>
              )
            }
          />
          <CardContent>
            {isEditingPost ? (
              <TextField
                variant="outlined"
                fullWidth
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
                onBlur={handleSavePost}
              />
            ) : (
              <Typography variant="body1" color="textPrimary" component="p">
                {post.content}
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" component="p">
              Created at: {new Date(post.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Updated at: {new Date(post.updatedAt).toLocaleString()}
            </Typography>
            <div className="likes-section relative group">
              <Typography variant="body2" color="textSecondary" component="p">
                {post.likes} likes
              </Typography>
              {isAuthenticated && userData && (
                <div className="relative inline-block">
                  {post.likedBy.some((user) => user._id === userData._id) ? (
                    <FavoriteIcon color="error" onClick={handleUnlike} />
                  ) : (
                    <FavoriteBorderIcon color="error" onClick={handleLike} />
                  )}
                  <Button onClick={handleOpen} className="ml-2">
                    See who liked this
                  </Button>
                  <Modal open={open} onClose={handleClose}>
                    <Box sx={modalStyle}>
                      <Typography variant="h6" component="h2">
                        Liked by:
                      </Typography>
                      <ul>
                        {likedBy.map((user) => (
                          <li key={user._id}>{user.username}</li>
                        ))}
                      </ul>
                    </Box>
                  </Modal>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-10">
          {isAuthenticated && (
            <form onSubmit={handleCommentSubmit} className="comment-form mb-4">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    id="newComment"
                    label="Add a Comment"
                    variant="outlined"
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="h-14"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}

          <Typography variant="h5" component="h3" gutterBottom className="mt-5">
            Comments
          </Typography>
          {comments.map((comment) => (
            <Card key={comment._id} className="comment-card mb-4">
              <CardContent>
                {editingCommentId === comment._id ? (
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={editCommentContent[comment._id] || comment.content}
                    onChange={(e) =>
                      handleEditComment(comment._id, e.target.value)
                    }
                    onBlur={() => handleSaveComment(comment._id)}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {comment.content}
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary" component="p">
                  {`- ${comment.user.username}, ${new Date(
                    comment.createdAt
                  ).toLocaleString()}`}
                </Typography>
                {isAuthenticated &&
                  userData &&
                  (userData.role === "admin" ||
                    userData._id === comment.user._id) && (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          handleEditComment(comment._id, comment.content)
                        }
                      >
                        Edit Comment
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Delete Comment
                      </Button>
                    </>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
      <Footer className="footer " />
    </div>
  );
};
