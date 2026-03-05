import { ENV } from "@/lib/ENV";

type CommentaryHandler = (data: any) => void;

class CommentarySocket {
  private socket: WebSocket | null = null;
  private matchId: number | null = null;
  private handler: CommentaryHandler | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private manualClose = false;

  connect(matchId: number, handler: CommentaryHandler) {
    if (this.matchId === matchId && this.socket && this.socket.readyState === WebSocket.OPEN) {
  return;
}
    this.matchId = matchId;
    this.handler = handler;
    this.manualClose = false;

    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onmessage = null;
      this.socket.close();
    }

    const socket = new WebSocket(ENV.WS_URL as string);
    this.socket = socket;

    socket.onopen = () => {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

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
if (this.socket.readyState === WebSocket.OPEN) {
  this.socket.close();
}{
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onmessage = null;
      this.socket.close();
    }

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