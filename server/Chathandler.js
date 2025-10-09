function chatHandler(io, socket) {
  socket.on("chat:send", ({ room, sender, message }) => {
    // Broadcast message to everyone in the room
    io.to(room).emit("chat:receive", { sender, message, time: new Date() });
  });

  socket.on("chat:typing", ({ room, sender }) => {
    socket.to(room).emit("chat:typing", { sender });
  });
}

module.exports = chatHandler;
