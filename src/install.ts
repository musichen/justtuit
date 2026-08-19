/**
 * Installer: turns a tool's package-manager identifiers (tool.managers) into
 * concrete shell install commands.
 *
 * Pure TypeScript: no OpenTUI import, no Bun-only FFI. Runs on Node and Bun.
 */

import type { Tool, Platform } from "./registry/types.js";

export interface InstallCommand {
  /** Display label, e.g. "Homebrew". */
  manager: string;
  /** Full shell command, e.g. "brew install btop". */
  command: string;
  /** "macos" | "linux" | "windows". */
  platform: Platform;
}

export type ManagerField = keyof Tool["managers"];

interface ManagerSpec {
  field: ManagerField;
  label: string;
  build: (id: string) => string;
  platforms: readonly Platform[];
}

// Canonical order (matches the registry field order). installCommands and
// commandsByManager emit entries in this order, independent of any platform.
const MANAGERS: readonly ManagerSpec[] = [
  { field: "brew", label: "Homebrew", build: (id) => `brew install ${id}`, platforms: ["macos", "linux"] },
  { field: "apt", label: "APT", build: (id) => `sudo apt install ${id}`, platforms: ["linux"] },
  { field: "dnf", label: "DNF", build: (id) => `sudo dnf install ${id}`, platforms: ["linux"] },
  { field: "pacman", label: "pacman", build: (id) => `sudo pacman -S ${id}`, platforms: ["linux"] },
  { field: "cargo", label: "cargo", build: (id) => `cargo install ${id}`, platforms: ["macos", "linux", "windows"] },
  { field: "go", label: "go", build: (id) => `go install ${id}@latest`, platforms: ["macos", "linux", "windows"] },
  { field: "npm", label: "npm", build: (id) => `npm install -g ${id}`, platforms: ["macos", "linux", "windows"] },
  { field: "pip", label: "pipx", build: (id) => `pipx install ${id}`, platforms: ["macos", "linux", "windows"] },
  { field: "scoop", label: "Scoop", build: (id) => `scoop install ${id}`, platforms: ["windows"] },
  { field: "winget", label: "Winget", build: (id) => `winget install ${id}`, platforms: ["windows"] },
  { field: "choco", label: "Chocolatey", build: (id) => `choco install ${id}`, platforms: ["windows"] },
];

const SPEC_BY_FIELD: ReadonlyMap<ManagerField, ManagerSpec> = new Map(
  MANAGERS.map((spec) => [spec.field, spec]),
);

// Per-platform preference order for bestInstallCommand.
const PREFERENCE: Record<Platform, readonly ManagerField[]> = {
  macos: ["brew", "cargo", "go", "npm", "pip"],
  linux: ["brew", "apt", "dnf", "pacman", "cargo", "go", "npm", "pip"],
  windows: ["winget", "scoop", "choco", "cargo", "go", "npm", "pip"],
};

function buildFor(tool: Tool, field: ManagerField, spec: ManagerSpec): InstallCommand[] {
  const id = tool.managers[field];
  if (id === undefined || id === "") return [];
  const command = spec.build(id);
  return spec.platforms.map((platform) => ({ manager: spec.label, command, platform }));
}

function listCommands(tool: Tool): InstallCommand[] {
  const out: InstallCommand[] = [];
  for (const spec of MANAGERS) {
    out.push(...buildFor(tool, spec.field, spec));
  }
  return out;
}

export function detectPlatform(): Platform {
  if (process.platform === "darwin") return "macos";
  if (process.platform === "win32") return "windows";
  return "linux";
}

/** All available install commands, sorted by canonical manager order. */
export function installCommands(tool: Tool): InstallCommand[] {
  return listCommands(tool);
}

/** Same set of commands, grouped by manager (all platforms per manager). */
export function commandsByManager(tool: Tool): InstallCommand[] {
  return listCommands(tool);
}

/** Best install method (field + identifier) for a platform, or null. */
export interface InstallMethod {
  field: ManagerField;
  label: string;
  id: string;
}

export function bestInstallMethod(tool: Tool, platform: Platform = detectPlatform()): InstallMethod | null {
  for (const field of PREFERENCE[platform]) {
    const spec = SPEC_BY_FIELD.get(field);
    if (!spec) continue;
    const id = tool.managers[field];
    if (id === undefined || id === "") continue;
    return { field, label: spec.label, id };
  }
  return null;
}

/** Best install command for the given platform (or the detected one). */
export function bestInstallCommand(tool: Tool, platform: Platform = detectPlatform()): InstallCommand | null {
  const method = bestInstallMethod(tool, platform);
  if (!method) return null;
  const spec = SPEC_BY_FIELD.get(method.field)!;
  return { manager: method.label, command: spec.build(method.id), platform };
}
