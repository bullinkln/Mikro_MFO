export type ErrorMessage = {
  type: "error";
  code: "invalid_payload" | "unknown_type" | "internal";
  message: string;
  details?: unknown;
};

export const sendError = (ws: import("ws").WebSocket, code: ErrorMessage["code"], message: string, details?: unknown) => {
  ws.send(JSON.stringify({ type: "error", code, message, details } satisfies ErrorMessage));
};




