import { useCallback, useEffect, useRef, useState } from "react";
import { UseSocket } from "../context/SocketProvider";
import { FaVideo, FaComments } from "react-icons/fa";
import peer from "../services/peer";
import Chatsection from "../components/Chatsection";

interface UserJoinedPayload {
  email: string;
  id: string;
}
interface IncomingCallPayload {
  from: string;
  offer: RTCSessionDescriptionInit;
}
interface CallAcceptedPayload {
  from: string;
  ans: RTCSessionDescriptionInit;
}
interface NegoNeededPayload {
  from: string;
  offer: RTCSessionDescriptionInit;
}
interface NegoFinalPayload {
  ans: RTCSessionDescriptionInit;
}

const Room = () => {
  const socket = UseSocket();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const getUserMediaStream = async () => {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    } catch (err) {
      console.error("Failed to get media:", err);
      return null;
    }
  };

  const sendStreams = useCallback(() => {
    if (myStream) {
      myStream.getTracks().forEach((track) => {
        peer.getPeer().addTrack(track, myStream);
      });
    }
  }, [myStream]);

  const handleCallUser = useCallback(async () => {
    const stream = await getUserMediaStream();
    if (!stream) return;
    setMyStream(stream);
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    sendStreams();

    const offer = await peer.getOffer();
    socket?.emit("user:call", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket, sendStreams]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: IncomingCallPayload) => {
      const stream = await getUserMediaStream();
      if (!stream) return;
      setMyStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      sendStreams();

      const ans = await peer.getAnswer(offer);
      socket?.emit("call:accepted", { to: from, ans });
    },
    [sendStreams, socket]
  );

  const handleCallAccepted = useCallback(
    async ({ ans }: CallAcceptedPayload) => {
      await peer.setRemoteDescription(ans);
    },
    []
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket?.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoIncoming = useCallback(
    async ({ from, offer }: NegoNeededPayload) => {
      const ans = await peer.getAnswer(offer);
      socket?.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoFinal = useCallback(async ({ ans }: NegoFinalPayload) => {
    await peer.setRemoteDescription(ans);
  }, []);

  useEffect(() => {
    const peerConnection = peer.getPeer();
    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    };
    peerConnection.onnegotiationneeded = handleNegoNeeded;
  }, [handleNegoNeeded]);

  useEffect(() => {
    if (!socket) return;

    // join room and receive existing users
    const roomId = window.location.pathname.split("/").pop() || "default-room";
    const myEmail = "anonymous";

    const tryJoin = () => {
      socket.emit("room:join", { email: myEmail, room: roomId });
    };

    if (socket.connected) tryJoin();
    else socket.on("connect", tryJoin);

    socket.on("room:users", (users: { id: string; email: string }[]) => {
      if (users.length > 0) setRemoteSocketId(users[0].id);
    });

    socket.on("user:joined", ({ email, id }: UserJoinedPayload) => {
      if (id !== socket.id) setRemoteSocketId(id);
    });

    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoIncoming);
    socket.on("peer:nego:final", handleNegoFinal);

    return () => {
      socket.off("connect", tryJoin);
      socket.off("room:users");
      socket.off("user:joined");
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoIncoming);
      socket.off("peer:nego:final", handleNegoFinal);
    };
  }, [
    socket,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoIncoming,
    handleNegoFinal,
  ]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white overflow-hidden">
      {/* Video Section */}
      <div className="flex-1 flex flex-col items-center justify-between p-4 md:p-6">
        <div className="w-full flex justify-between items-center mb-4">
          <h1 className="text-xl md:text-2xl font-semibold">Meeting Room</h1>
          <p className="text-gray-400 text-sm md:text-base">
            {remoteSocketId ? "Connected" : "Waiting for user..."}
          </p>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="rounded-xl shadow-lg border border-gray-700 object-cover w-72 sm:w-80 md:w-96"
            />
            <span className="absolute bottom-2 left-3 bg-black/60 text-xs px-2 py-1 rounded-md">
              You
            </span>
          </div>

          <div className="relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              className="rounded-xl shadow-lg border border-gray-700 object-cover w-72 sm:w-80 md:w-96"
            />
            <span className="absolute bottom-2 left-3 bg-black/60 text-xs px-2 py-1 rounded-md">
              Guest
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-6 mt-4 md:mt-6 flex-wrap">
          <button className="p-3 md:p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition">
            🎤
          </button>
          {remoteSocketId && (
            <button
              onClick={handleCallUser}
              className="p-3 md:p-4 bg-blue-600 rounded-full hover:bg-blue-500 transition"
            >
              <FaVideo size={20} />
            </button>
          )}
          <button className="p-3 md:p-4 bg-red-600 rounded-full hover:bg-red-500 transition">
            📞
          </button>
          <button
            onClick={() => setChatOpen(true)}
            className="p-3 md:p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition"
          >
            <FaComments size={20} />
          </button>
        </div>
      </div>

      {/* Chat Section */}
      <Chatsection isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Room;
