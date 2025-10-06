// src/services/peer.ts

class PeerServices {
  private peer: RTCPeerConnection;

  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }

  getPeer() {
    return this.peer;
  }

  async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  async getAnswer(
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit | undefined> {
    await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
    const ans = await this.peer.createAnswer();
    await this.peer.setLocalDescription(ans);
    return ans;
  }

  async setLocalDescription(desc: RTCSessionDescriptionInit) {
    await this.peer.setLocalDescription(new RTCSessionDescription(desc));
  }

  async setRemoteDescription(desc: RTCSessionDescriptionInit) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(desc));
  }

  addTrack(track: MediaStreamTrack, stream: MediaStream) {
    this.peer.addTrack(track, stream);
  }
}

export default new PeerServices();
