import { ENV } from "@/lib/ENV";

type CommentaryHandler = (data: any) => void;

class CommentarySocket {
  private socket: WebSocket | null = null;
  private matchId: number | null = null;
  private handler: CommentaryHandler | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private manualClose = false;

  connect(matchId: number, handler: CommentaryHandler) {
    this.matchId = matchId;
    this.handler = handler;
    this.manualClose = false;

    if (this.socket) {
      this.socket.close();
    }

    const socket = new WebSocket(ENV.WS_URL as string);
    this.socket = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "subscribe",
          matchId,
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "commentary_created") {
          this.handler?.(message.data);
        }
      } catch {}
    };

    socket.onclose = () => {
      if (!this.manualClose) {
        this.scheduleReconnect();
      }
    };

    socket.onerror = () => {
      socket.close();
    };
  }

  unsubscribe() {
    if (!this.socket || this.matchId === null) return;

    this.manualClose = true;

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "unsubscribe",
          matchId: this.matchId,
        })
      );
    }

    this.socket.close();
    this.socket = null;
  }

  private scheduleReconnect() {
    if (!this.matchId || !this.handler) return;

    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      this.connect(this.matchId!, this.handler!);
      this.reconnectTimer = null;
    }, 3000);
  }
}

export const commentarySocket = new CommentarySocket();