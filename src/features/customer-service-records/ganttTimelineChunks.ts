const DAY_MS = 86_400_000;
export const GANTT_CHUNK_DAYS = 42;

export function ganttChunkId(date: Date): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS / GANTT_CHUNK_DAYS
  );
}

export function ganttChunkRange(id: number): { from: string; to: string } {
  const first = new Date(id * GANTT_CHUNK_DAYS * DAY_MS);
  const last = new Date((id * GANTT_CHUNK_DAYS + GANTT_CHUNK_DAYS - 1) * DAY_MS);
  return { from: first.toISOString().slice(0, 10), to: last.toISOString().slice(0, 10) };
}

export function ganttChunkIds(from: Date, to: Date): number[] {
  const first = ganttChunkId(from);
  const last = ganttChunkId(to);
  return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => first + index);
}
