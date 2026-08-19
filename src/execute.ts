/**
 * Execution: runs a maintenance command (install / update / remove) or a tool's
 * binary in the user's real terminal.
 *
 * Per resolved decision 02: suspend the OpenTUI renderer (leave the alternate
 * screen and restore cooked terminal mode), spawn the child with inherited
 * stdio so its output streams through, then resume the renderer on exit and
 * report the outcome.
 */

import { spawn } from "node:child_process";
import type { CliRenderer } from "@opentui/core";

export interface ExecOutcome {
  /** True when the child exited 0 without a signal or spawn error. */
  ok: boolean;
  /** Exit code, or null on spawn error. */
  code: number | null;
  /** Signal name that terminated the child, or null. */
  signal: NodeJS.Signals | null;
  /** Spawn error message, if the child could not be started. */
  error?: string;
}

/**
 * Run a shell command with the renderer suspended.
 *
 * Suspends synchronously (so no further frames are painted while the child
 * owns the terminal), then resolves once the child exits and the renderer has
 * been resumed. Never throws.
 */
export function runInTerminal(renderer: CliRenderer, command: string): Promise<ExecOutcome> {
  return new Promise((resolve) => {
    renderer.suspend();

    let child;
    try {
      child = spawn(command, { shell: true, stdio: "inherit" });
    } catch (err) {
      renderer.resume();
      resolve({
        ok: false,
        code: null,
        signal: null,
        error: err instanceof Error ? err.message : String(err),
      });
      return;
    }

    let settled = false;
    const finish = (outcome: ExecOutcome) => {
      if (settled) return;
      settled = true;
      try {
        renderer.resume();
      } catch {
        // Resume is best-effort; the renderer may already be destroyed.
      }
      resolve(outcome);
    };

    child.on("error", (err: Error) => {
      finish({ ok: false, code: null, signal: null, error: err.message });
    });
    child.on("exit", (code: number | null, signal: NodeJS.Signals | null) => {
      finish({ ok: code === 0 && signal === null, code, signal });
    });
  });
}
