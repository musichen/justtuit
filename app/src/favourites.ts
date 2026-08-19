/**
 * Favourites persistence (resolved decision 04).
 *
 * A single lightweight JSON array of tool ids at ~/.justtuit/favourites.json.
 * Read once at startup (tolerates missing/corrupt -> empty), written atomically
 * on change (temp file + rename). No sqlite, no migrations.
 */

import { readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

function favouritesPath(): string {
  return path.join(homedir(), ".justtuit", "favourites.json");
}

export function loadFavourites(): string[] {
  try {
    const raw = readFileSync(favouritesPath(), "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function saveFavourites(ids: string[]): void {
  const file = favouritesPath();
  try {
    mkdirSync(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    writeFileSync(tmp, JSON.stringify(ids, null, 2) + "\n");
    renameSync(tmp, file);
  } catch {
    // Best-effort persistence: never crash the TUI over a failed write.
  }
}
