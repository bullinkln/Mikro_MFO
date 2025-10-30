import type { ClientCtx, RoomState, HitContext } from "./types";
import type { BalanceUpdateEvent, JoinRoomEvent, HitFeedbackEvent } from "../../shared/events";
import { WebSocket } from "ws";

const f = 0.20; // базовый коэффициент RM
const zoneMultiplier = {
  head: 1.5,
  body: 1.0,
  limb: 0.5
};

export class RoomWorker {
  state: RoomState;

  constructor(public roomId: string) {
    this.state = {
      roomId,
      createdAt: Date.now(),
      players: new Map()
    };
    console.log(`[room:${roomId}] created`);
  }

  addPlayer(ctx: ClientCtx, join: JoinRoomEvent) {
    ctx.roomId = this.state.roomId;
    ctx.balance = join.deposit;
    this.state.players.set(ctx.playerId, ctx);

    // рассылаем участникам состав комнаты
    this.broadcast({
      type: "balance_update",
      playerId: ctx.playerId,
      newBalance: ctx.balance,
      delta: ctx.balance,
      reason: "deposit"
    } as BalanceUpdateEvent);

    this.broadcastRoster();
  }

  removePlayer(playerId: string) {
    this.state.players.delete(playerId);
    this.broadcastRoster();
    if (this.state.players.size === 0) {
      console.log(`[room:${this.state.roomId}] empty -> idle`);
    }
  }

  get(playerId: string) {
    return this.state.players.get(playerId);
  }

  handleHit(hit: HitContext) {
    const attacker = this.get(hit.attackerId);
    const target = this.get(hit.targetId);
    
    if (!attacker || !target) {
      console.log(`[room:${this.state.roomId}] hit failed: player not found`);
      return;
    }

    // Проверяем, что у атакующего есть баланс для атаки
    if (attacker.balance <= 0) {
      console.log(`[room:${this.state.roomId}] hit failed: attacker has no balance`);
      return;
    }

    const m = zoneMultiplier[hit.zone];
    const base = attacker.balance;
    const delta = Math.round(base * f * m * hit.power);
    
    if (delta <= 0) {
      console.log(`[room:${this.state.roomId}] hit failed: delta too small`);
      return;
    }

    // Обновляем балансы (не уходим в минус)
    attacker.balance = Math.max(0, attacker.balance + delta);
    target.balance = Math.max(0, target.balance - delta);

    const feedback: HitFeedbackEvent = {
      type: "hit_feedback",
      attackerId: hit.attackerId,
      targetId: hit.targetId,
      zone: hit.zone,
      delta,
      balanceAttacker: attacker.balance,
      balanceTarget: target.balance,
      ts: Date.now()
    };

    console.log(`[room:${this.state.roomId}] hit: ${hit.attackerId} -> ${hit.targetId} (${hit.zone}) delta=${delta}`);
    this.broadcast(feedback);
  }

  broadcastRoster() {
    const roster = [...this.state.players.values()].map(p => ({
      playerId: p.playerId,
      nickname: p.nickname,
      balance: p.balance
    }));
    this.broadcast({ type: "roster", roomId: this.state.roomId, roster } as any);
  }

  broadcast(msg: object) {
    const data = JSON.stringify(msg);
    for (const p of this.state.players.values()) {
      if (p.socket.readyState === WebSocket.OPEN) {
        p.socket.send(data);
      }
    }
  }
}
