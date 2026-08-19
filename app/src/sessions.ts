/**
 * tmux session manager (resolved decision 10).
 *
 * Launches TUI tools in detached tmux sessions so the user can run one, detach
 * (leave it running), list running apps, re-attach, or kill it - the
 * "fast-resume / agent-deck" behaviour.
 *
 * Session naming: `justtuit-<slug>-<n>` (the `-<n>` suffix allows multiple
 * instances of the same tool). The tool is resolved back from the slug in the
 * session name via a longest-prefix match against the registry.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tools } from "./registry/tools.js";
import type { Tool } from "./registry/types.js";

const execFileAsync = promisify(execFile);

const PREFIX = "justtuit-";

export interface SessionInfo {
  /** Full tmux session name, e.g. "justtuit-btop-1". */
  name: string;
  /** The resolved tool, or null if the slug does not match the registry. */
  tool: Tool | null;
  /** Display name (tool name, or the raw slug when unresolved). */
  toolName: string;
}

function suffix(name: string): string {
  return name.startsWith(PREFIX) ? name.slice(PREFIX.length) : name;
}

function resolveTool(slug: string): Tool | null {
  let best: Tool | null = null;
  for (const t of tools) {
    if (slug === t.id || slug.startsWith(`${t.id}-`)) {
      if (!best || t.id.length > best.id.length) best = t;
    }
  }
  return best;
}

export async function tmuxAvailable(): Promise<boolean> {
  try {
    await execFileAsync("tmux", ["-V"], { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

export async function listSessions(): Promise<SessionInfo[]> {
  try {
    const { stdout } = await execFileAsync("tmux", ["ls", "-F", "#{session_name}"], { timeout: 5000 });
    return stdout
      .trim()
      .split("\n")
      .filter((n) => n.startsWith(PREFIX))
      .map((name) => {
        const slug = suffix(name);
        const tool = resolveTool(slug);
        return { name, tool, toolName: tool?.name ?? slug };
      });
  } catch {
    return []; // tmux not running, or no sessions
  }
}

/** Launch `command` in a new detached session; returns the session name. */
export async function launchSession(tool: Tool, command: string): Promise<string> {
  const existing = new Set((await listSessions()).map((s) => s.name));
  let n = 1;
  let name = `${PREFIX}${tool.id}-${n}`;
  while (existing.has(name)) {
    n += 1;
    name = `${PREFIX}${tool.id}-${n}`;
  }
  await execFileAsync("tmux", ["new-session", "-d", "-s", name, command], { timeout: 5000 });
  return name;
}

export async function killSession(name: string): Promise<void> {
  try {
    await execFileAsync("tmux", ["kill-session", "-t", name], { timeout: 5000 });
  } catch {
    // Session already gone.
  }
}

/** Full `tmux attach` command for use with execute.ts's runInTerminal. */
export function attachCommand(name: string): string {
  return `tmux attach -t ${name}`;
}
