import { playHitSound, vibrate } from "../audio/sfx.js";
import { showFloatingText, flashHit, screenShake } from "./effects.js";
import { updateHUD } from "./hud.js";

export function onHitFeedback(event: any) {
  const { attackerId, targetId, delta, zone, balanceAttacker, balanceTarget } = event;

  // 1️⃣ Обновляем HUD
  updateHUD(attackerId, balanceAttacker);
  updateHUD(targetId, balanceTarget);

  // 2️⃣ Визуальный отклик
  const text = delta > 0 ? `+${delta}` : `${delta}`;
  showFloatingText(targetId, text, delta > 0 ? "green" : "red");

  // 3️⃣ Вспышка и shake при ударе в голову
  flashHit(targetId);
  if (zone === "head") screenShake();

  // 4️⃣ Звук и вибрация
  playHitSound(zone);
  if (zone !== "limb") vibrate(zone);
}

