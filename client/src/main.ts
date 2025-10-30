import { handleServerEvent } from "./ws/events.js";

// Инициализация WebSocket соединения
const ws = new WebSocket(import.meta.env.VITE_WS_URL || "ws://localhost:8788");

ws.onopen = () => {
  console.log("🔌 WebSocket connected");
};

ws.onmessage = (msg) => {
  try {
    const data = JSON.parse(msg.data);
    handleServerEvent(data);
  } catch (error) {
    console.error("❌ Failed to parse WebSocket message:", error);
  }
};

ws.onerror = (error) => {
  console.error("❌ WebSocket error:", error);
};

ws.onclose = () => {
  console.log("🔌 WebSocket disconnected");
};

// Экспорт для использования в других модулях
export { ws };

