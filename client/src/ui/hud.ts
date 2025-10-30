const hudBalances = new Map();

export function updateHUD(playerId: string, newBalance: number) {
  const el = hudBalances.get(playerId);
  if (el) {
    el.textContent = newBalance.toFixed(0);
    el.classList.add("pulse");
    setTimeout(() => el.classList.remove("pulse"), 500);
  }
}

export function registerHUD(playerId: string, element: HTMLElement) {
  hudBalances.set(playerId, element);
}

