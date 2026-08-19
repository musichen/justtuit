/**
 * Installer: turns a tool's package-manager identifiers (tool.managers) into
 * concrete shell commands for the install / update / remove verbs.
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

/** Maintenance verb. */
export type Verb = "install" | "update" | "remove";

interface ManagerSpec {
  field: ManagerField;
  label: string;
  /** Per-verb command builder. A verb is unsupported when absent. */
  verbs: Partial<Record<Verb, (id: string) => string>>;
  platforms: readonly Platform[];
}

// Canonical order (matches the registry field order).
const MANAGERS: readonly ManagerSpec[] = [
  {
    field: "brew",
    label: "Homebrew",
    platforms: ["macos", "linux"],
    verbs: {
      install: (id) => `brew install ${id}`,
      update: (id) => `brew upgrade ${id}`,
      remove: (id) => `brew uninstall ${id}`,
    },
  },
  {
    field: "apt",
    label: "APT",
    platforms: ["linux"],
    verbs: {
      install: (id) => `sudo apt install ${id}`,
      update: (id) => `sudo apt install --only-upgrade ${id}`,
      remove: (id) => `sudo apt remove ${id}`,
    },
  },
  {
    field: "dnf",
    label: "DNF",
    platforms: ["linux"],
    verbs: {
      install: (id) => `sudo dnf install ${id}`,
      update: (id) => `sudo dnf upgrade ${id}`,
      remove: (id) => `sudo dnf remove ${id}`,
    },
  },
  {
    field: "pacman",
    label: "pacman",
    platforms: ["linux"],
    verbs: {
      install: (id) => `sudo pacman -S ${id}`,
      update: (id) => `sudo pacman -S ${id}`,
      remove: (id) => `sudo pacman -R ${id}`,
    },
  },
  {
    field: "cargo",
    label: "cargo",
    platforms: ["macos", "linux", "windows"],
    verbs: {
      install: (id) => `cargo install ${id}`,
      update: (id) => `cargo install ${id} --force`,
      remove: (id) => `cargo uninstall ${id}`,
    },
  },
  {
    field: "go",
    label: "go",
    platforms: ["macos", "linux", "windows"],
    verbs: {
      install: (id) => `go install ${id}@latest`,
      update: (id) => `go install ${id}@latest`,
      // remove: go does not track installed binaries, so no remove command.
    },
  },
  {
    field: "npm",
    label: "npm",
    platforms: ["macos", "linux", "windows"],
    verbs: {
      install: (id) => `npm install -g ${id}`,
      update: (id) => `npm update -g ${id}`,
      remove: (id) => `npm uninstall -g ${id}`,
    },
  },
  {
    field: "pip",
    label: "pipx",
    platforms: ["macos", "linux", "windows"],
    verbs: {
      install: (id) => `pipx install ${id}`,
      update: (id) => `pipx upgrade ${id}`,
      remove: (id) => `pipx uninstall ${id}`,
    },
  },
  {
    field: "scoop",
    label: "Scoop",
    platforms: ["windows"],
    verbs: {
      install: (id) => `scoop install ${id}`,
      update: (id) => `scoop update ${id}`,
      remove: (id) => `scoop uninstall ${id}`,
    },
  },
  {
    field: "winget",
    label: "Winget",
    platforms: ["windows"],
    verbs: {
      install: (id) => `winget install ${id}`,
      update: (id) => `winget upgrade ${id}`,
      remove: (id) => `winget uninstall ${id}`,
    },
  },
  {
    field: "choco",
    label: "Chocolatey",
    platforms: ["windows"],
    verbs: {
      install: (id) => `choco install ${id}`,
      update: (id) => `choco upgrade ${id}`,
      remove: (id) => `choco uninstall ${id}`,
    },
  },
];

const SPEC_BY_FIELD: ReadonlyMap<ManagerField, ManagerSpec> = new Map(
  MANAGERS.map((spec) => [spec.field, spec]),
);

// Per-platform preference order for bestInstallCommand / bestCommand.
const PREFERENCE: Record<Platform, readonly ManagerField[]> = {
  macos: ["brew", "cargo", "go", "npm", "pip"],
  linux: ["brew", "apt", "dnf", "pacman", "cargo", "go", "npm", "pip"],
  windows: ["winget", "scoop", "choco", "cargo", "go", "npm", "pip"],
};

export function detectPlatform(): Platform {
  if (process.platform === "darwin") return "macos";
  if (process.platform === "win32") return "windows";
  return "linux";
}

/** Build the per-platform commands a manager offers for a single verb. */
function buildFor(tool: Tool, spec: ManagerSpec, verb: Verb): InstallCommand[] {
  const id = tool.managers[spec.field];
  if (id === undefined || id === "") return [];
  const build = spec.verbs[verb];
  if (!build) return [];
  const command = build(id);
  return spec.platforms.map((platform) => ({ manager: spec.label, command, platform }));
}

/** All available commands for a verb, in canonical manager order. */
export function commandsFor(tool: Tool, verb: Verb): InstallCommand[] {
  const out: InstallCommand[] = [];
  for (const spec of MANAGERS) out.push(...buildFor(tool, spec, verb));
  return out;
}

/** All install commands (backward-compatible alias). */
export function installCommands(tool: Tool): InstallCommand[] {
  return commandsFor(tool, "install");
}

/** Same set of commands, grouped by manager (all platforms per manager). */
export function commandsByManager(tool: Tool): InstallCommand[] {
  return commandsFor(tool, "install");
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

/** Best command for a verb on the given platform (or the detected one). */
export function bestCommand(
  tool: Tool,
  verb: Verb,
  platform: Platform = detectPlatform(),
): InstallCommand | null {
  for (const field of PREFERENCE[platform]) {
    const spec = SPEC_BY_FIELD.get(field);
    if (!spec) continue;
    const id = tool.managers[field];
    if (id === undefined || id === "") continue;
    const build = spec.verbs[verb];
    if (!build) continue;
    return { manager: spec.label, command: build(id), platform };
  }
  return null;
}

/** Best install command for the given platform (backward-compatible alias). */
export function bestInstallCommand(tool: Tool, platform: Platform = detectPlatform()): InstallCommand | null {
  return bestCommand(tool, "install", platform);
}
