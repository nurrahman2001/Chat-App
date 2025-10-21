// Simple test script to check server connectivity
const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  transports: ['websocket', 'polling'],
});

socket.on("connect", () => {
  console.log("✅ Socket connected successfully!");
  console.log("Socket ID:", socket.id);
  
  // Test adding a user
  socket.emit("add-user", "test-user-123");
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection failed:", error.message);
});

socket.on("online-users", (users) => {
  console.log("📱 Online users:", users);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Socket disconnected:", reason);
});

// Test HTTP endpoint
const axios = require('axios');

async function testHTTP() {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/allusers', {
      headers: {
        'Authorization': 'Bearer invalid-token-for-testing'
      }
    });
    console.log("HTTP Response:", response.status);
  } catch (error) {
    if (error.response) {
      console.log("✅ HTTP Server responding (expected auth error):", error.response.status);
    } else {
      console.error("❌ HTTP Server not accessible:", error.message);
    }
  }
}

testHTTP();

setTimeout(() => {
  console.log("Test completed");
  process.exit(0);
}, 5000);