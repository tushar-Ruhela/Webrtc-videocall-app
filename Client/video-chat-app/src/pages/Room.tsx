import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseSocket } from "../context/SocketProvider";
import peer from "../services/peer";
import Chatsection from "../components/Chatsection";
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaComments,
  FaDesktop,
  FaPhoneSlash,
} from "react-icons/fa";

interface UserJoinedPayload  { email: string; id: string; }
interface IncomingCallPayload { from: string; offer: RTCSessionDescriptionInit; }
interface CallAcceptedPayload { from: string; ans: RTCSessionDescriptionInit; }
interface NegoNeededPayload  { from: string; offer: RTCSessionDescriptionInit; }
interface NegoFinalPayload   { ans: RTCSessionDescriptionInit; }
interface IceCandidatePayload { from: string; candidate: RTCIceCandidateInit; }

const Room = () => {
  const socket = UseSocket();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"waiting" | "connected" | "disconnected">("waiting");

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef  = useRef<HTMLVideoElement | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Get the logged-in user's email
  const userEmail = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u).email : "anonymous";
    } catch { return "anonymous"; }
  })();

  // ─── Media helpers ────────────────────────────────────────────────────────

  const getUserMedia = async (): Promise<MediaStream | null> => {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    } catch (err) {
      console.error("Could not get camera/microphone:", err);
      return null;
    }
  };

  /**
   * Send all local tracks to the peer connection.
   * Must be called AFTER the stream is set in state.
   */
  const sendStreams = useCallback((stream: MediaStream) => {
    const peerConn = peer.getPeer();
    // Avoid adding duplicate tracks
    const existingSenders = peerConn.getSenders().map((s) => s.track?.id);
    stream.getTracks().forEach((track) => {
      if (!existingSenders.includes(track.id)) {
        peerConn.addTrack(track, stream);
      }
    });
  }, []);

  // ─── Call user ────────────────────────────────────────────────────────────

  const handleCallUser = useCallback(async () => {
    const stream = await getUserMedia();
    if (!stream) return;
    setMyStream(stream);
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    sendStreams(stream);
    const offer = await peer.getOffer();
    socket?.emit("user:call", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket, sendStreams]);

  // ─── Incoming call ────────────────────────────────────────────────────────

  const handleIncomingCall = useCallback(
    async ({ from, offer }: IncomingCallPayload) => {
      const stream = await getUserMedia();
      if (!stream) return;
      setMyStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      sendStreams(stream);
      const ans = await peer.getAnswer(offer);
      socket?.emit("call:accepted", { to: from, ans });
      setConnectionStatus("connected");
    },
    [sendStreams, socket]
  );

  const handleCallAccepted = useCallback(async ({ ans }: CallAcceptedPayload) => {
    await peer.setRemoteDescription(ans);
    setConnectionStatus("connected");
  }, []);

  // ─── Negotiation ──────────────────────────────────────────────────────────

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

  // ─── ICE candidates ───────────────────────────────────────────────────────

  const handleIceCandidate = useCallback(
    async ({ candidate }: IceCandidatePayload) => {
      if (candidate) {
        await peer.addIceCandidate(candidate);
      }
    },
    []
  );

  // ─── Media toggles ────────────────────────────────────────────────────────

  const toggleAudio = () => {
    if (!myStream) return;
    myStream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsAudioEnabled((p) => !p);
  };

  const toggleVideo = () => {
    if (!myStream) return;
    myStream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsVideoEnabled((p) => !p);
  };

  // ─── Screen sharing ───────────────────────────────────────────────────────

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing — restore camera
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;

      const cameraStream = await getUserMedia();
      if (!cameraStream) return;
      setMyStream(cameraStream);
      if (localVideoRef.current) localVideoRef.current.srcObject = cameraStream;

      const videoTrack = cameraStream.getVideoTracks()[0];
      if (videoTrack) await peer.replaceVideoTrack(videoTrack);

      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        screenStreamRef.current = screenStream;

        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;

        const screenTrack = screenStream.getVideoTracks()[0];
        await peer.replaceVideoTrack(screenTrack);
        setIsScreenSharing(true);

        // When user stops via browser button
        screenTrack.onended = async () => {
          screenStreamRef.current = null;
          const cameraStream = await getUserMedia();
          if (!cameraStream) return;
          setMyStream(cameraStream);
          if (localVideoRef.current) localVideoRef.current.srcObject = cameraStream;
          const videoTrack = cameraStream.getVideoTracks()[0];
          if (videoTrack) await peer.replaceVideoTrack(videoTrack);
          setIsScreenSharing(false);
        };
      } catch (err) {
        console.error("Screen share error:", err);
      }
    }
  };

  // ─── Hang up ─────────────────────────────────────────────────────────────

  const hangUp = useCallback(() => {
    myStream?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    socket?.emit("call:leave", { room: roomId });
    peer.resetPeer();
    navigate("/home");
  }, [myStream, socket, roomId, navigate]);

  // ─── RTCPeerConnection event wiring ──────────────────────────────────────

  useEffect(() => {
    const peerConn = peer.getPeer();

    peerConn.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConn.onnegotiationneeded = handleNegoNeeded;

    // Forward local ICE candidates to the remote peer
    peerConn.onicecandidate = (event) => {
      if (event.candidate && remoteSocketId) {
        socket?.emit("ice:candidate", { to: remoteSocketId, candidate: event.candidate.toJSON() });
      }
    };

    peerConn.onconnectionstatechange = () => {
      const state = peerConn.connectionState;
      if (state === "connected") setConnectionStatus("connected");
      if (state === "disconnected" || state === "failed") setConnectionStatus("disconnected");
    };
  }, [handleNegoNeeded, remoteSocketId, socket]);

  // ─── Socket event wiring ─────────────────────────────────────────────────

  useEffect(() => {
    if (!socket) return;

    const myEmail = userEmail;
    const joinRoom = () => {
      socket.emit("room:join", { email: myEmail, room: roomId });
    };

    if (socket.connected) joinRoom();
    else socket.on("connect", joinRoom);

    socket.on("room:users", (users: { id: string; email: string }[]) => {
      const others = users.filter((u) => u.id !== socket.id);
      if (others.length > 0) {
        setRemoteSocketId(others[0].id);
        setConnectionStatus("connected");
      }
    });

    socket.on("user:joined", ({ email: _email, id }: UserJoinedPayload) => {
      if (id !== socket.id) {
        setRemoteSocketId(id);
        setConnectionStatus("connected");
      }
    });

    socket.on("incoming:call",      handleIncomingCall);
    socket.on("call:accepted",      handleCallAccepted);
    socket.on("peer:nego:needed",   handleNegoIncoming);
    socket.on("peer:nego:final",    handleNegoFinal);
    socket.on("ice:candidate",      handleIceCandidate);

    socket.on("user:left", () => {
      setRemoteSocketId(null);
      setConnectionStatus("waiting");
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    });

    return () => {
      socket.off("connect", joinRoom);
      socket.off("room:users");
      socket.off("user:joined");
      socket.off("incoming:call",    handleIncomingCall);
      socket.off("call:accepted",    handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoIncoming);
      socket.off("peer:nego:final",  handleNegoFinal);
      socket.off("ice:candidate",    handleIceCandidate);
      socket.off("user:left");
    };
  }, [socket, roomId, userEmail, handleIncomingCall, handleCallAccepted, handleNegoIncoming, handleNegoFinal, handleIceCandidate]);

  // ─── Status indicator ─────────────────────────────────────────────────────

  const statusColor = connectionStatus === "connected" ? "#22c55e" : connectionStatus === "disconnected" ? "#ef4444" : "#f59e0b";
  const statusLabel = connectionStatus === "connected" ? "Connected" : connectionStatus === "disconnected" ? "Disconnected" : "Waiting for participant…";

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        fontFamily: "DM Sans, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Main meeting area ───────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.875rem 1.5rem",
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "linear-gradient(135deg, #6c63ff, #c084fc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaVideo style={{ color: "#fff", fontSize: 13 }} />
            </div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1 }}>
                Room: <span style={{ color: "var(--accent-bright)" }}>{roomId}</span>
              </div>
              <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: 2 }}>
                {userEmail}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: statusColor,
                display: "inline-block",
                boxShadow: `0 0 8px ${statusColor}`,
              }}
            />
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{statusLabel}</span>
          </div>
        </div>

        {/* Video tiles */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            padding: "1.25rem",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto",
          }}
        >
          {/* Local video */}
          <div
            className="video-tile"
            style={{
              width: "clamp(260px, 40%, 480px)",
              aspectRatio: "16/9",
              flexShrink: 0,
            }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 12,
                background: "rgba(0,0,0,0.6)",
                borderRadius: 6,
                padding: "3px 8px",
                fontSize: "0.75rem",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              {isScreenSharing && (
                <FaDesktop size={10} style={{ color: "var(--accent-bright)" }} />
              )}
              You {isScreenSharing ? "(Screen)" : ""}
            </div>
            {!myStream && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                }}
              >
                <FaVideoSlash size={28} style={{ opacity: 0.4 }} />
                Camera off
              </div>
            )}
          </div>

          {/* Remote video */}
          <div
            className="video-tile"
            style={{
              width: "clamp(260px, 40%, 480px)",
              aspectRatio: "16/9",
              flexShrink: 0,
            }}
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 12,
                background: "rgba(0,0,0,0.6)",
                borderRadius: 6,
                padding: "3px 8px",
                fontSize: "0.75rem",
                backdropFilter: "blur(4px)",
              }}
            >
              Participant
            </div>
            {!remoteSocketId && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                }}
              >
                <FaVideo size={28} style={{ opacity: 0.2 }} />
                Waiting…
              </div>
            )}
          </div>
        </div>

        {/* Control bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.875rem",
            padding: "1.25rem 1.5rem",
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          {/* Mute / unmute */}
          <button
            onClick={toggleAudio}
            title={isAudioEnabled ? "Mute mic" : "Unmute mic"}
            className={`control-btn ${isAudioEnabled ? "control-btn-default" : "control-btn-muted"}`}
          >
            {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>

          {/* Video toggle */}
          <button
            onClick={toggleVideo}
            title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            className={`control-btn ${isVideoEnabled ? "control-btn-default" : "control-btn-muted"}`}
          >
            {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
          </button>

          {/* Screen share */}
          <button
            onClick={toggleScreenShare}
            title={isScreenSharing ? "Stop screen share" : "Share screen"}
            className={`control-btn ${isScreenSharing ? "control-btn-active" : "control-btn-default"}`}
          >
            <FaDesktop />
          </button>

          {/* Call user (if remote is waiting) */}
          {remoteSocketId && !connectionStatus.includes("connected") && (
            <button
              onClick={handleCallUser}
              title="Start call"
              className="control-btn control-btn-active"
              style={{ fontSize: "1rem" }}
            >
              📞
            </button>
          )}

          {/* Call user shortcut when connected */}
          {remoteSocketId && (
            <button
              onClick={handleCallUser}
              title="(Re)start call"
              className="control-btn control-btn-active"
            >
              📞
            </button>
          )}

          {/* Chat */}
          <button
            onClick={() => setChatOpen((p) => !p)}
            title="Open chat"
            className={`control-btn ${chatOpen ? "control-btn-active" : "control-btn-default"}`}
          >
            <FaComments />
          </button>

          {/* Hang up */}
          <button
            onClick={hangUp}
            title="Leave meeting"
            className="control-btn control-btn-danger"
          >
            <FaPhoneSlash />
          </button>
        </div>
      </div>

      {/* ── Chat sidebar ────────────────────────────────────────────────── */}
      <Chatsection
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        room={roomId || null}
        userEmail={userEmail}
        isConnected={!!remoteSocketId}
      />
    </div>
  );
};

export default Room;
