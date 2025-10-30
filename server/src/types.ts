import type { JoinRoomEvent, BalanceUpdateEvent } from "../../shared/events";

export type ClientCtx = {
  socket: import('ws').WebSocket;
  playerId: string;
  nickname: string;
  roomId?: string;
  balance: number;
  ping: number;
  version: string;
};

export type RoomState = {
  roomId: string;
  createdAt: number;
  players: Map<string, ClientCtx>;
};

export interface HitContext {
  attackerId: string;
  targetId: string;
  zone: "head" | "body" | "limb";
  power: number;
  roomId: string;
}
