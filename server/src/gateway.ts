import { WebSocketServer, WebSocket } from "ws";
import { RoomRegistry } from "./roomRegistry";
import type { ClientCtx } from "./types";
import type { JoinRoomEvent } from "../../shared/events";
import { sendError } from "./errors";
import { validate } from "./validate";

export class Gateway {
  wss: WebSocketServer;
  rooms = new RoomRegistry();

  constructor(public port: number) {
    this.wss = new WebSocketServer({ port });
    this.wss.on("connection", (ws) => this.onConnection(ws));
    console.log(`[gateway] WS listening on :${port}`);
  }

  onConnection(socket: WebSocket) {
    const ctx: ClientCtx = {
      socket,
      playerId: "",
      nickname: "",
      balance: 0,
      ping: 0,
      version: "unknown"
    };

    socket.on("message", (buf) => {
      let msg: any;
      try { msg = JSON.parse(buf.toString()); } catch {
        sendError(socket, "invalid_payload", "JSON parse failed");
        return;
      }

      switch (msg.type) {
        case "join_room": {
          const { ok, errors } = validate("join_room", msg);
          if (!ok) {
            sendError(socket, "invalid_payload", "join_room schema validation failed", errors);
            return;
          }
          this.handleJoin(ctx, msg as JoinRoomEvent);
          return;
        }
        case "hit_event": {
          const { ok, errors } = validate("hit_event", msg);
          if (!ok) {
            sendError(socket, "invalid_payload", "hit_event schema validation failed", errors);
            return;
          }
          const room = this.rooms.get(msg.roomId);
          if (!room) {
            sendError(socket, "invalid_payload", "room not found");
            return;
          }
          room.handleHit(msg);
          return;
        }
        case "ping": {
          socket.send(JSON.stringify({ type: "pong", ts: Date.now() }));
          return;
        }
        default:
          sendError(socket, "unknown_type", `unknown message type: ${String(msg.type)}`);
          return;
      }
    });

    socket.on("close", () => {
      if (ctx.roomId) {
        const w = this.rooms.get(ctx.roomId);
        w?.removePlayer(ctx.playerId);
      }
      console.log(`[gateway] disconnect ${ctx.playerId || "unknown"}`);
    });
  }

  handleJoin(ctx: ClientCtx, join: JoinRoomEvent) {
    ctx.playerId = join.playerId;
    ctx.nickname = join.nickname;
    ctx.ping = join.ping;
    ctx.version = join.version;

    const worker = this.rooms.ensure(join.roomId);
    worker.addPlayer(ctx, join);

    ctx.socket.send(JSON.stringify({
      type: "joined",
      roomId: join.roomId,
      playerId: join.playerId,
      ts: Date.now()
    }));
    console.log(`[gateway] join ${join.roomId} <- ${join.playerId} (${join.nickname})`);
  }
}
