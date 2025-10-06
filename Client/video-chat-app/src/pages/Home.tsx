import { useCallback, useEffect, useState } from "react";
import { UseSocket } from "../context/SocketProvider";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaVideo } from "react-icons/fa";

const Home = () => {
  const [email, setEmail] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const socket: Socket | null = UseSocket();
  const navigate = useNavigate();

  // Get logged-in user info from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setEmail(parsed.email || "");
      setUsername(parsed.name || "");
    }
  }, []);

  // Handle form submission to join a room
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email.trim() || !room.trim()) {
        alert("Please enter both email and room.");
        return;
      }
      socket?.emit("room:join", { room, email });
    },
    [email, room, socket]
  );

  // Listen for server confirmation
 useEffect(() => {
  const handleRoomJoined = (data: any) => {
    const { room } = data;
    navigate(`/room/${room}`);
  };

  if (!socket) return;

  socket.on("room:joined-success", handleRoomJoined);

  return () => {
    socket.off("room:joined-success", handleRoomJoined);
  };
}, [socket]); // only socket is needed


  // Optional: Start call directly
  const startCall = () => {
    if (!username) return alert("User not logged in.");
    const defaultRoom = "general-room"; // default room
    setRoom(defaultRoom);
    socket?.emit("room:join", { room: defaultRoom, email });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Navbar */}
      <Navbar />

      {/* User Section */}
      <div className="flex flex-col items-center mt-24 sm:mt-28 px-4">
        {username ? (
          <div className="flex items-center gap-4 bg-white shadow-md rounded-xl px-6 py-4 mb-6">
            <p className="text-lg font-medium text-indigo-700">
              Logged in as: {username}
            </p>
            <button
              onClick={startCall}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FaVideo /> Start Call
            </button>
          </div>
        ) : (
          <p className="text-gray-700 mb-4">Please log in to start a call</p>
        )}
      </div>

      {/* Join Room Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-purple-300">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-700 mb-6">
            Join a Meeting
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="room"
                className="block text-gray-700 font-medium mb-1"
              >
                Room
              </label>
              <input
                id="room"
                type="text"
                placeholder="Enter room name"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full ${
                username ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
              } transition duration-300 text-white font-semibold py-2 rounded-lg shadow-md`}
              disabled={!username}
            >
              Join Room
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-4 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} VideoConnect — All Rights Reserved.
      </footer>
    </div>
  );
};

export default Home;
