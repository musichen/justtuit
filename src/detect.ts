/**
 * Detection: answers "is this tool already installed?" for a platform.
 *
 * Pure TypeScript: no OpenTUI import. Uses the first/best offered install
 * method's package manager (per the resolved decision), falling back to a PATH
 * probe of the tool's binaries.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { detectPlatform, bestInstallMethod } from "./install.js";
import type { Tool, Platform } from "./registry/types.js";

const execFileAsync = promisify(execFile);

export interface DetectResult {
  installed: boolean;
  /** How it was checked, e.g. "Homebrew", "APT", "PATH". */
  source: string;
  /** The probe command run, for display, e.g. "brew list --formula btop". */
  command: string;
}

interface Probe {
  cmd: string;
  args: string[];
  display: string;
}

// Manager field -> "is <id> installed?" probe. Exit 0 = installed.
const PKG_PROBES: Record<string, (id: string) => Probe> = {
  brew: (id) => ({ cmd: "brew", args: ["list", "--formula", id], display: `brew list --formula ${id}` }),
  apt: (id) => ({ cmd: "dpkg-query", args: ["-W", "-f=${Status}", id], display: `dpkg-query -W ${id}` }),
  dnf: (id) => ({ cmd: "dnf", args: ["list", "installed", id], display: `dnf list installed ${id}` }),
  pacman: (id) => ({ cmd: "pacman", args: ["-Q", id], display: `pacman -Q ${id}` }),
  winget: (id) => ({ cmd: "winget", args: ["list", "--id", id], display: `winget list --id ${id}` }),
  choco: (id) => ({ cmd: "choco", args: ["list", "--exact", id], display: `choco list --exact ${id}` }),
};

// These managers install a binary onto PATH rather than registering a package,
// so detection is a binary probe.
const BINARY_FIELDS = new Set(["cargo", "go", "npm", "pip", "scoop"]);

function whichCmd(platform: Platform): string {
  return platform === "windows" ? "where" : "which";
}

/**
 * Run a probe. Returns "missing" when the probe command itself is not on the
 * system (e.g. `brew` absent), so the caller can fall back to a PATH probe.
 */
async function probeStatus(cmd: string, args: string[]): Promise<boolean | "missing"> {
  try {
    await execFileAsync(cmd, args, { timeout: 4000, windowsHide: true });
    return true;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT") return "missing";
    return false;
  }
}

async function probeBinary(binaries: string[], platform: Platform): Promise<DetectResult | null> {
  const cmd = whichCmd(platform);
  for (const bin of binaries) {
    const status = await probeStatus(cmd, [bin]);
    if (status === true) return { installed: true, source: "PATH", command: `${cmd} ${bin}` };
  }
  return null;
}

export async function detectInstalled(
  tool: Tool,
  platform: Platform = detectPlatform(),
): Promise<DetectResult> {
  const method = bestInstallMethod(tool, platform);

  if (method && !BINARY_FIELDS.has(method.field)) {
    const probe = PKG_PROBES[method.field];
    if (probe) {
      const { cmd, args, display } = probe(method.id);
      const status = await probeStatus(cmd, args);
      if (status !== "missing") {
        return { installed: status, source: method.label, command: display };
      }
      // Manager not present: fall through to PATH probe.
    }
  }

  const bin = await probeBinary(tool.binaries, platform);
  if (bin) return bin;

  if (tool.binaries.length === 0) {
    return { installed: false, source: "no binary", command: "" };
  }

  return {
    installed: false,
    source: "PATH",
    command: `${whichCmd(platform)} ${tool.binaries[0]}`,
  };
}
