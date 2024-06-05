import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { Footer } from "../partials/footer";
import { Heading } from "../partials/heading";
import "./Chat.css";

const socket = io("http://localhost:8000");

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState("");
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("channel");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/userdata",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        navigate("/auth");
      }
    };

    fetchUserData();

    socket.on("initialMessages", (initialMessages) => {
      setMessages(initialMessages);
    });

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("messageEdited", (editedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === editedMessage._id ? editedMessage : msg
        )
      );
    });

    socket.on("messageDeleted", (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && userData) {
      const newMessage = {
        userId: userData._id,
        username: userData.username,
        content: message,
        createdAt: new Date(),
        toUser: selectedUser === "channel" ? null : selectedUser,
      };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  const handleEditMessage = (messageId, newContent) => {
    socket.emit("editMessage", { messageId, newContent });
    setEditMessageId(null);
    setEditMessageContent("");
  };

  const handleDeleteMessage = (messageId) => {
    socket.emit("deleteMessage", messageId);
  };

  if (!userData) {
    return (
      <Container>
        <Typography variant="h5" component="h2" gutterBottom>
          Loading user data...
        </Typography>
      </Container>
    );
  }

  return (
    <div>
      <Heading />
      <Container className="mb-10">
        <Typography variant="h4" component="h1" gutterBottom>
          Chat
        </Typography>
        <Box
          className="chat-container"
          sx={{ bgcolor: "#f9f9f9", borderRadius: 2, p: 2 }}
        >
          <List
            className="messages"
            sx={{ maxHeight: "300px", overflow: "auto" }}
          >
            {messages.map((msg) => (
              <React.Fragment key={msg._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" component="span">
                        <strong>{msg.username}</strong> (
                        {new Date(msg.createdAt).toLocaleString()}):
                      </Typography>
                    }
                    secondary={
                      editMessageId === msg._id ? (
                        <TextField
                          variant="outlined"
                          fullWidth
                          value={editMessageContent}
                          onChange={(e) =>
                            setEditMessageContent(e.target.value)
                          }
                          onBlur={() =>
                            handleEditMessage(msg._id, editMessageContent)
                          }
                          autoFocus
                        />
                      ) : (
                        msg.content
                      )
                    }
                  />
                  {msg.userId === userData._id && (
                    <>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditMessageId(msg._id);
                          setEditMessageContent(msg.content);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleDeleteMessage(msg._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
          <Box className="chat-input" sx={{ display: "flex", mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              sx={{ mr: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};
