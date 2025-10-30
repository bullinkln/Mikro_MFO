import { onHitFeedback } from "../ui/hitFeedback.js";

export function handleServerEvent(event: any) {
  switch (event.type) {
    case "hit_feedback":
      onHitFeedback(event);
      break;
    case "balance_update":
      updateBalance(event);
      break;
    default:
      console.warn("Unknown server event:", event.type);
  }
}

function updateBalance(event: any) {
  // Обновление баланса при других событиях
  console.log("Balance update:", event);
}

