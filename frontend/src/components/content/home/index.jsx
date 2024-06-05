import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Footer } from "../../partials/footer";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../AuthContext";
import { Heading } from "../../partials/heading";
import "./style.css";

export const Home = () => {
  const { userData } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/posts/get-posts?page=${page}&limit=9&sortBy=createdAt&order=desc&search=${searchQuery}`
      )
      .then((response) => {
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, searchQuery]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Heading />
      <div className="flex-grow container mx-auto px-4 py-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Home
        </Typography>
        <div className="posts grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {posts.map((post) => (
            <motion.div
              key={post._id}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <Link to={`/post/${post._id}`}>
                <Card className="post h-full">
                  <CardHeader
                    title={post.title}
                    subheader={`Author: ${post.user.username}`}
                  />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {post.content.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </div>
      </div>
      <Footer className="footer mt-auto" />
    </div>
  );
};
