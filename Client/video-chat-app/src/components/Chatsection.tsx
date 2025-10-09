// src/components/Chat.tsx
import React, { useEffect, useState, useRef } from "react";
import { UseSocket } from "../context/SocketProvider";

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  room: string | null;       // room to send/receive messages
  userEmail: string | null;  // current user's email
  isConnected: boolean;      // true when user joined a room
}

const Chatsection: React.FC<ChatProps> = ({ isOpen, onClose, room, userEmail, isConnected }) => {
  const socket = UseSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { sender: string; message: string; time: string }[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (data: { sender: string; message: string; time: string }) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("chat:receive", handleReceive);

    return () => {
      socket.off("chat:receive", handleReceive);
    };
  }, [socket]);

  // Send a message
  const sendMessage = () => {
    if (!socket || !room || !userEmail || message.trim() === "") return;

    const newMessage = {
      sender: userEmail,
      message: message.trim(),
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("chat:send", { room, sender: userEmail, message });
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div
      className={`fixed md:static top-0 right-0 h-full w-80 bg-gray-850 border-l border-gray-700 flex flex-col transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat</h2>
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.sender === userEmail
                ? "bg-blue-600 self-end ml-auto"
                : "bg-gray-800 self-start"
            }`}
          >
            <p className="text-sm text-gray-200">{msg.message}</p>
            <p className="text-[10px] text-gray-400 mt-1">{msg.time}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-gray-700 flex items-center gap-2">
        <input
          type="text"
          placeholder={
            isConnected ? "Send a message..." : "Connect to start chatting"
          }
          className="flex-1 bg-gray-800 p-2 rounded-lg outline-none text-sm text-gray-200"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isConnected}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className={`p-2 rounded-lg transition ${
            isConnected
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          disabled={!isConnected}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatsection;
