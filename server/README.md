# RM Server
Node.js / WS / Room-Worker на комнату.  
Пока заготовка. Реализацию добавим отдельным шагом (контракты, события).

## Server runtime
- WebSocket gateway на PORT_WS (по умолчанию 8788).
- Комнаты инкапсулированы в RoomWorker (один воркер на roomId).
- Сейчас реализованы: подключение, join_room, рассылка roster и balance_update (deposit как стартовый баланс).
- Валидация схем и экономика ударов будут добавлены отдельным шагом, синхронизированно с `shared/schemas/*` и логикой ragdoll.

## Validation & Errors
- Входящие WS-сообщения валидируются AJV по схемам из `shared/schemas`.
- Сейчас проверяются: `join_room` (обязательно), `hit_event` (заготовка).
- На невалидный payload сервер отвечает:
  ```json
  { "type":"error", "code":"invalid_payload", "message":"<...>", "details":[ ...ajv errors... ] }
  ```
- На неизвестный type: `{ "type":"error", "code":"unknown_type", "message":"unknown message type: <type>" }`.
- Сервер не падает ни при каких входных данных.

## HitEvent Pipeline
- Клиент отправляет `hit_event` → сервер проверяет схему (AJV).  
- Сервер вычисляет урон `Δ = f × balance_attacker × m(zone)`.  
- Обновляет балансы обоих игроков.  
- Всем участникам рассылается `hit_feedback` с новым балансом и зоной удара.  
- Сервер — единственный источник расчёта (client-side hit только инициирует).
