// src/services/peer.ts
// Improved WebRTC peer service with ICE candidate queuing, TURN server support,
// and screenShare / peer-reset capabilities.

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:global.stun.twilio.com:3478",
      ],
    },
    // Open TURN relay for NAT traversal (metered.ca free tier)
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
  iceCandidatePoolSize: 10,
};

class PeerService {
  private peer: RTCPeerConnection;
  /** Candidates buffered before remoteDescription is set */
  private iceCandidateQueue: RTCIceCandidateInit[] = [];
  private remoteDescSet = false;

  constructor() {
    this.peer = this.createPeer();
  }

  private createPeer(): RTCPeerConnection {
    return new RTCPeerConnection(ICE_CONFIG);
  }

  /** Get the underlying RTCPeerConnection */
  getPeer(): RTCPeerConnection {
    return this.peer;
  }

  /**
   * Destroy current peer and create a fresh one.
   * Call this when ending a call so next call starts clean.
   */
  resetPeer(): RTCPeerConnection {
    try {
      this.peer.close();
    } catch (_) {
      // ignore
    }
    this.iceCandidateQueue = [];
    this.remoteDescSet = false;
    this.peer = this.createPeer();
    return this.peer;
  }

  // ─── Offer / Answer ──────────────────────────────────────────────────────

  async getOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  async getAnswer(
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> {
    await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
    await this.flushIceCandidates();
    const ans = await this.peer.createAnswer();
    await this.peer.setLocalDescription(ans);
    return ans;
  }

  async setLocalDescription(desc: RTCSessionDescriptionInit): Promise<void> {
    await this.peer.setLocalDescription(new RTCSessionDescription(desc));
  }

  /**
   * Set remote description and flush any queued ICE candidates.
   */
  async setRemoteDescription(desc: RTCSessionDescriptionInit): Promise<void> {
    await this.peer.setRemoteDescription(new RTCSessionDescription(desc));
    this.remoteDescSet = true;
    await this.flushIceCandidates();
  }

  // ─── ICE Candidate queuing ───────────────────────────────────────────────

  /**
   * Queue an ICE candidate received from the remote peer.
   * If remoteDescription is already set, apply it immediately.
   */
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (this.remoteDescSet) {
      try {
        await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn("ICE candidate error:", err);
      }
    } else {
      this.iceCandidateQueue.push(candidate);
    }
  }

  private async flushIceCandidates(): Promise<void> {
    this.remoteDescSet = true;
    const queue = [...this.iceCandidateQueue];
    this.iceCandidateQueue = [];
    for (const candidate of queue) {
      try {
        await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn("Flushed ICE candidate error:", err);
      }
    }
  }

  // ─── Track management ────────────────────────────────────────────────────

  addTrack(track: MediaStreamTrack, stream: MediaStream): void {
    this.peer.addTrack(track, stream);
  }

  /**
   * Replace the video sender's track (for screen sharing).
   * @param newTrack - the screen-capture VideoStreamTrack
   */
  async replaceVideoTrack(newTrack: MediaStreamTrack): Promise<void> {
    const senders = this.peer.getSenders();
    const videoSender = senders.find((s) => s.track?.kind === "video");
    if (videoSender) {
      await videoSender.replaceTrack(newTrack);
    }
  }
}

export default new PeerService();
