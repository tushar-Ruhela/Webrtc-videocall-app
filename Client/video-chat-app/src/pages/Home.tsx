import { useCallback, useEffect, useState } from "react";
import { UseSocket } from "../context/SocketProvider";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaVideo, FaRandom } from "react-icons/fa";

const generateRoomId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const Home = () => {
  const [email, setEmail] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const socket: Socket | null = UseSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setEmail(parsed.email || "");
      setUsername(parsed.name || "");
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email.trim() || !room.trim()) {
        alert("Please enter a room name.");
        return;
      }
      socket?.emit("room:join", { room, email });
    },
    [email, room, socket]
  );

  useEffect(() => {
    const handleRoomJoined = (data: any) => {
      const { room } = data;
      navigate(`/room/${room}`);
    };

    if (!socket) return;
    socket.on("room:joined-success", handleRoomJoined);
    return () => { socket.off("room:joined-success", handleRoomJoined); };
  }, [socket, navigate]);

  return (
    <div
      className="noise"
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Navbar />

      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 1.5rem 3rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ width: "100%", maxWidth: 480 }}>
          {/* Welcome header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #6c63ff, #c084fc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 28px rgba(108,99,255,0.5)",
                margin: "0 auto 1rem",
              }}
            >
              <FaVideo style={{ color: "#fff", fontSize: 24 }} />
            </div>
            <h1
              className="font-display gradient-text"
              style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}
            >
              {username ? `Hey, ${username} 👋` : "Join a Meeting"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Enter a room name below to start or join a meeting.
            </p>
          </div>

          {/* Form card */}
          <div
            className="glass-card"
            style={{ padding: "2rem" }}
          >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    marginBottom: "0.4rem",
                  }}
                >
                  Your email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    marginBottom: "0.4rem",
                  }}
                >
                  Room name
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    id="room"
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="input-dark"
                    placeholder="e.g. team-standup"
                    required
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    title="Generate random room"
                    onClick={() => setRoom(generateRoomId())}
                    className="btn-ghost"
                    style={{
                      padding: "0 0.875rem",
                      borderRadius: 8,
                      flexShrink: 0,
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <FaRandom size={12} />
                  </button>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.3rem" }}>
                  Anyone with the same room name can join.
                </p>
              </div>

              <button
                type="submit"
                disabled={!username}
                className="btn-glow"
                style={{
                  padding: "0.85rem",
                  borderRadius: 10,
                  fontSize: "0.95rem",
                  opacity: !username ? 0.5 : 1,
                  cursor: !username ? "not-allowed" : "pointer",
                }}
              >
                {username ? "Join Room →" : "Please log in first"}
              </button>
            </form>
          </div>

          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "1.25rem" }}>
            Room names are case-sensitive. Share the exact name for others to join.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
