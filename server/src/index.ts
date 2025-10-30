import { Gateway } from "./gateway";

const port = Number(process.env.PORT_WS || 8788);
new Gateway(port);

// Напоминание для команды:
// Детализацию ударов/экономики не добавляем здесь.
// На следующем шаге подключим серверную логику hit-detection,
// синхронизацию с базовой физикой из github.com/onedoes/ragdollmasters
// и применим формулы (f, m(zone), rake) согласно shared-событиям.
