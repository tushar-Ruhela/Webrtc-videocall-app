// src/components/Chatsection.tsx
import React, { useEffect, useState, useRef } from "react";
import { UseSocket } from "../context/SocketProvider";
import { FaTimes, FaPaperPlane } from "react-icons/fa";

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  room: string | null;
  userEmail: string | null;
  isConnected: boolean;
}

const Chatsection: React.FC<ChatProps> = ({ isOpen, onClose, room, userEmail, isConnected }) => {
  const socket = UseSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { sender: string; message: string; time: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
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
    return () => { socket.off("chat:receive", handleReceive); };
  }, [socket]);

  const sendMessage = () => {
    if (!socket || !room || !userEmail || message.trim() === "") return;
    const newMessage = {
      sender: userEmail,
      message: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    socket.emit("chat:send", { room, sender: userEmail, message: message.trim() });
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className={`chat-sidebar ${isOpen ? "open" : ""}`}>
      {/* Header */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span
          className="font-display"
          style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}
        >
          Chat
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
        >
          <FaTimes size={14} />
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              marginTop: "2rem",
            }}
          >
            No messages yet
          </div>
        )}
        {messages.map((msg, index) => {
          const isOwn = msg.sender === userEmail;
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isOwn ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  background: isOwn
                    ? "var(--accent)"
                    : "var(--bg-elevated)",
                  borderRadius: isOwn ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  padding: "0.6rem 0.85rem",
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                }}
              >
                {msg.message}
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  marginTop: "0.25rem",
                }}
              >
                {msg.time}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          padding: "0.75rem 1rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          placeholder={isConnected ? "Send a message…" : "Join a call to chat"}
          className="input-dark"
          style={{ flex: 1, fontSize: "0.875rem", padding: "0.6rem 0.85rem" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isConnected}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || message.trim() === ""}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: isConnected && message.trim() ? "var(--accent)" : "rgba(255,255,255,0.08)",
            color: isConnected && message.trim() ? "#fff" : "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isConnected && message.trim() ? "pointer" : "not-allowed",
            flexShrink: 0,
            transition: "background 0.2s, color 0.2s",
          }}
        >
          <FaPaperPlane size={13} />
        </button>
      </div>
    </div>
  );
};

export default Chatsection;
