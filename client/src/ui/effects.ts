export function showFloatingText(playerId: string, text: string, color: string) {
  const el = document.createElement("div");
  el.className = "float-text";
  el.style.color = color;
  el.style.position = "absolute";
  el.style.fontSize = "24px";
  el.style.fontWeight = "bold";
  el.style.pointerEvents = "none";
  el.style.zIndex = "1000";
  el.style.transition = "opacity 1.5s ease-out, transform 1.5s ease-out";
  el.style.transform = "translateY(-50px)";
  el.style.opacity = "1";
  el.textContent = text;
  
  // Позиционируем относительно игрока
  const playerEl = document.getElementById(`player-${playerId}`);
  if (playerEl) {
    const rect = playerEl.getBoundingClientRect();
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top = `${rect.top}px`;
  }
  
  document.body.appendChild(el);
  
  // Анимация исчезновения
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(-100px)";
    setTimeout(() => el.remove(), 1500);
  }, 100);
}

export function flashHit(playerId: string) {
  const el = document.getElementById(`player-${playerId}`);
  if (!el) return;
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 200);
}

export function screenShake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 250);
}

