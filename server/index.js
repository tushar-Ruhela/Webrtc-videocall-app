const { Server } = require("socket.io");
const chatHandler = require("./Chathandler");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.origin || "*",
      methods: ["GET", "POST"],
    },
  });

  const emailToSocketId = new Map();
  const socketIdToEmail = new Map();
  
  const roomToSockets = new Map();

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("room:join", (data) => {
      const { email, room } = data;
      emailToSocketId.set(email, socket.id);
      socketIdToEmail.set(socket.id, email);
      socket.join(room);

      // Track room membership
      if (!roomToSockets.has(room)) roomToSockets.set(room, new Set());
      roomToSockets.get(room).add(socket.id);

      console.log(`${email} joined room ${room}`);

      // Confirm to the joiner
      io.to(socket.id).emit("room:joined-success", { room, email });

      // Send existing users in the room (excluding the joiner)
      const others = [...(roomToSockets.get(room) || [])]
        .filter((id) => id !== socket.id)
        .map((id) => ({ id, email: socketIdToEmail.get(id) || "unknown" }));
      if (others.length > 0) {
        io.to(socket.id).emit("room:users", others);
      }

      // Notify other participants of the new joiner
      socket.to(room).emit("user:joined", { email, id: socket.id });
    });

    socket.on("user:call", ({ to, offer }) => {
      io.to(to).emit("incoming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted", { from: socket.id, ans });
    });


    // ── ICE candidate relay ────────────────────────────────────────────
    socket.on("ice:candidate", ({ to, candidate }) => {
      io.to(to).emit("ice:candidate", { from: socket.id, candidate });
    });

    // ── Leave call voluntarily ─────────────────────────────────────────
    socket.on("call:leave", ({ room }) => {
      socket.to(room).emit("user:left", { id: socket.id });
    });

    // ── Chat ───────────────────────────────────────────────────────────
    chatHandler(io, socket);

    // ── Disconnect ─────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
      const email = socketIdToEmail.get(socket.id);
      emailToSocketId.delete(email);
      socketIdToEmail.delete(socket.id);

      // Remove from all rooms and notify peers
      roomToSockets.forEach((sockets, room) => {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          socket.to(room).emit("user:left", { id: socket.id });
          if (sockets.size === 0) roomToSockets.delete(room);
        }
      });
    });
  });

  console.log("✅ Socket.IO server ready");
}

module.exports = initSocket;
