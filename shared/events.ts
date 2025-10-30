export type JoinRoomEvent = {
  type: 'join_room';
  roomId: string;
  playerId: string;
  nickname: string;
  deposit: number;
  ping: number;
  version: string;
};

export interface HitEvent {
  type: "hit_event";
  attackerId: string;
  targetId: string;
  roomId: string;
  zone: "head" | "body" | "limb";
  power: number; // 0–1 — сила удара
  ts: number;
}

export interface HitFeedbackEvent {
  type: "hit_feedback";
  attackerId: string;
  targetId: string;
  zone: "head" | "body" | "limb";
  delta: number; // списание/начисление
  balanceAttacker: number;
  balanceTarget: number;
  ts: number;
}

export type BalanceUpdateEvent = {
  type: 'balance_update';
  playerId: string;
  newBalance: number;
  delta: number;
  reason: 'hit' | 'deposit' | 'withdraw' | 'adjust';
};

export type RMEvent = JoinRoomEvent | HitEvent | HitFeedbackEvent | BalanceUpdateEvent;
