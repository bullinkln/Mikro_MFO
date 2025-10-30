import Ajv from "ajv";
import { readFileSync } from "fs";
import { join } from "path";

// Читаем JSON схемы из файлов
const JoinRoomSchema = JSON.parse(readFileSync(join(process.cwd(), "../shared/schemas/JoinRoom.schema.json"), "utf-8"));
const HitEventSchema = JSON.parse(readFileSync(join(process.cwd(), "../shared/schemas/HitEvent.schema.json"), "utf-8"));

const ajv = new Ajv({ allErrors: true, removeAdditional: "failing", strict: false });

export const validateJoinRoom = ajv.compile(JoinRoomSchema as any);
export const validateHitEvent = ajv.compile(HitEventSchema as any);

export type SchemaName = "join_room" | "hit_event";

export function validate(schema: SchemaName, data: unknown) {
  const fn = schema === "join_room" ? validateJoinRoom : validateHitEvent;
  const ok = fn(data);
  return { ok, errors: fn.errors };
}
