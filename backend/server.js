const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongooseConnection = require("./helpers/db.js");
const appRoutes = require("./routes");

const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const Message = require("./models/message"); // Import the message model

const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api", appRoutes);

mongooseConnection();

io.on("connection", (socket) => {
  console.log("New client connected");

  Message.find()
    .sort({ createdAt: 1 })
    .then((messages) => {
      socket.emit("initialMessages", messages);
    });

  socket.on("sendMessage", async (message) => {
    const newMessage = new Message(message);
    await newMessage.save();
    io.emit("receiveMessage", newMessage);
  });

  socket.on("editMessage", async ({ messageId, newContent }) => {
    const message = await Message.findById(messageId);
    if (message) {
      message.content = newContent;
      await message.save();
      io.emit("messageEdited", message);
    }
  });

  socket.on("deleteMessage", async (messageId) => {
    await Message.findByIdAndDelete(messageId);
    io.emit("messageDeleted", messageId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
