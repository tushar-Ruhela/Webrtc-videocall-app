const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin:process.env.origin || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  const emailToSocketId = new Map();
  const socketIdToEmailId = new Map();

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("room:join", (data) => {
  const { email, room } = data;

  emailToSocketId.set(email, socket.id);
  socketIdToEmailId.set(socket.id, email);

  socket.join(room);
  console.log(`${email} joined room ${room}`);

  // Notify the user that they successfully joined the room
  io.to(socket.id).emit("room:joined-success", { room, email });

  // Notify all other users in the room
  socket.to(room).emit("user:joined", { email, id: socket.id });
});


    socket.on("user:call", ({ to, offer }) => {
      io.to(to).emit("incoming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
      io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
      const email = socketIdToEmailId.get(socket.id);
      emailToSocketId.delete(email);
      socketIdToEmailId.delete(socket.id);
    });
  });

  console.log("✅ Socket.IO server is running and ready to accept connections");
}

module.exports = initSocket;
