const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const socket = require("socket.io");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const app = express();
require("dotenv").config();

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads directory at:", uploadDir);
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



const allowedOrigins = [
  "https://chat-app-delta-ebon.vercel.app",
  "https://chat-app-git-main-nur-rahmans-projects-294c2e4f.vercel.app",
  "https://chat-938wpehmz-nur-rahmans-projects-294c2e4f.vercel.app/",
  "http://localhost:5173", // for local dev 
  
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoutes);

console.log("Loaded Mongo URL:", process.env.MONGO_URL);


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log(err.message));

const server = app.listen(process.env.PORT,'0.0.0.0', () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);
    return res.status(400).json({ msg: "File upload error", error: err.message });
  }

  if (err) {
    console.error("Server error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }

  next();
});

// Socket setup for real-time processing
const io = socket(server, {
 cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  // Add user to online map and broadcast to all
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(global.onlineUsers.keys()));
  });

  // Send message
  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-recieve", {
        from: data.from,
        message: data.message,
      });
    }
  });


  // Typing indicator
  socket.on("typing", ({ from, to }) => {
    const receiverSocket = global.onlineUsers.get(to);
    if (receiverSocket) {
      io.to(receiverSocket).emit("user-typing", from);
    }
  });

  socket.on("stop-typing", ({ from, to }) => {
    const receiverSocket = global.onlineUsers.get(to);
    if (receiverSocket) {
      io.to(receiverSocket).emit("user-stop-typing", from);
    }
  });

  // WebRTC call signaling setup
  socket.on("call-user", ({ to, from, name, avatar, callType, offer }) => {
    const sendUserSocket = global.onlineUsers.get(to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("incoming-call", {
        from,
        name,
        avatar,
        callType,
        offer,
      });
    }
  });

  // Add call answer handler
  socket.on("call-answer", (data) => {
    const { to, answer } = data;
    const sendUserSocket = global.onlineUsers.get(to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("call-answered", { answer, from: data.from });
    }
  });

  // Update rejection handler
  socket.on("reject-call", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("call-rejected");
    }
  });

  // Add call end handler
  socket.on("call-ended", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("call-ended");
    }
  });

  // Update ICE candidate handler
  socket.on("ice-candidate", (data) => {
    const { candidate, to } = data;
    const sendUserSocket = global.onlineUsers.get(to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("ice-candidate", { candidate });
    }
  });
  // Handle Disconnection
  socket.on("disconnect", () => {
    for (const [userId, socketId] of global.onlineUsers.entries()) {
      if (socketId === socket.id) {
        global.onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("online-users", Array.from(global.onlineUsers.keys()));
  });
});
