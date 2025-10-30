import { RoomWorker } from "./roomWorker";

export class RoomRegistry {
  private rooms = new Map<string, RoomWorker>();

  get(roomId: string) {
    return this.rooms.get(roomId);
  }

  ensure(roomId: string) {
    let w = this.rooms.get(roomId);
    if (!w) {
      w = new RoomWorker(roomId);
      this.rooms.set(roomId, w);
    }
    return w;
  }

  delete(roomId: string) {
    this.rooms.delete(roomId);
  }

  listIds() {
    return [...this.rooms.keys()];
  }
}
