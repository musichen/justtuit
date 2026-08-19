import { createCliRenderer, TextAttributes } from "@opentui/core";
import type { KeyEvent } from "@opentui/core";
import { createRoot, useKeyboard, useTerminalDimensions, useRenderer } from "@opentui/react";
import { useState, useEffect, useMemo } from "react";
import { categories, tools } from "./registry/tools.js";
import type { Tool, Platform } from "./registry/types.js";
import { bestInstallCommand, bestCommand, installCommands, detectPlatform } from "./install.js";
import type { InstallCommand } from "./install.js";
import { runInTerminal } from "./execute.js";
import { scoreTool } from "./fuzzy.js";
import { detectInstalled } from "./detect.js";
import type { DetectResult } from "./detect.js";
import { exec } from "node:child_process";

// ── Non-interactive CLI (registry introspection) ──────────────────────────
// These paths print and exit before the TUI renderer is created, so they also
// work in scripts / CI without a terminal.

const args = process.argv.slice(2);
const flag = args[0];

function printList(list: Tool[]) {
  for (const t of list) {
    console.log(`${t.name}\t${t.url}\t${t.description}`);
  }
}

if (flag === "--help" || flag === "-h") {
  console.log(`Just TUI it! - a TUI for TUI tools

Usage:
  justtuit                 launch the interactive TUI
  justtuit --count         print the number of tools and categories
  justtuit --categories    list categories
  justtuit --list [cat]    list tools (optionally filtered by category slug)
  justtuit --help          show this help
`);
  process.exit(0);
}

if (flag === "--count") {
  console.log(`${tools.length} tools across ${categories.length} categories`);
  process.exit(0);
}

if (flag === "--categories") {
  for (const c of categories) console.log(`${c.id}\t${c.name}`);
  process.exit(0);
}

if (flag === "--list") {
  const cat = args[1];
  const list = cat ? tools.filter((t) => t.category === cat) : tools;
  printList(list);
  process.exit(0);
}

// ── Interactive TUI ────────────────────────────────────────────────────────

const C = {
  bg: "#0f172a",
  paneBg: "#0b1220",
  border: "#334155",
  header: "#38bdf8",
  accent: "#22d3ee",
  fg: "#e2e8f0",
  muted: "#64748b",
  dim: "#94a3b8",
  selBg: "#1e293b",
  selFg: "#f8fafc",
  green: "#4ade80",
};

const CATEGORY_NAMES = new Map<string, string>(categories.map((c) => [c.id, c.name]));

function catName(id: string): string {
  return CATEGORY_NAMES.get(id) ?? id;
}

interface SideEntry {
  id: string | null;
  name: string;
  count: number;
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function computeWindow(
  total: number,
  cursor: number,
  height: number,
): { start: number; end: number } {
  if (total === 0) return { start: 0, end: 0 };
  const cur = clamp(cursor, 0, total - 1);
  let start = cur - Math.floor(height / 2);
  let end = start + height;
  if (start < 0) {
    start = 0;
    end = Math.min(height, total);
  }
  if (end > total) {
    end = total;
    start = Math.max(0, end - height);
  }
  return { start, end };
}

function charForKey(e: KeyEvent): string | null {
  if (e.name === "space") return " ";
  if (e.name.length === 1) return e.name;
  return null;
}

function shQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function copyToClipboard(text: string): boolean {
  if (!text) return false;
  const platform = process.platform;
  const command =
    platform === "darwin"
      ? `printf %s ${shQuote(text)} | pbcopy`
      : platform === "win32"
        ? `echo ${shQuote(text)} | clip`
        : `printf %s ${shQuote(text)} | xclip -selection clipboard`;
  try {
    exec(command, (err) => {
      if (err) {
        // Best-effort: clipboard helpers are not always installed.
      }
    });
    return true;
  } catch {
    return false;
  }
}

function openUrl(url: string): void {
  if (!url) return;
  const platform = process.platform;
  const command =
    platform === "darwin"
      ? `open ${shQuote(url)}`
      : platform === "win32"
        ? `start "" ${shQuote(url)}`
        : `xdg-open ${shQuote(url)}`;
  try {
    exec(command, (err) => {
      if (err) {
        // Best-effort open.
      }
    });
  } catch {
    // Best-effort open.
  }
}

function Header(props: { search: string; searchMode: boolean }) {
  return (
    <box
      flexDirection="column"
      border={["bottom"]}
      borderColor={C.border}
      paddingX={1}
      paddingY={0}
    >
      <box flexDirection="row" alignItems="center" gap={2}>
        <text content="Just TUI it!" fg={C.header} attributes={TextAttributes.BOLD} />
        <text content="a TUI for TUI tools" fg={C.muted} />
      </box>
      <box flexDirection="row" alignItems="center" gap={1}>
        <text
          content="/"
          fg={props.searchMode ? C.accent : C.muted}
          attributes={TextAttributes.BOLD}
        />
        <input
          flexGrow={1}
          value={props.search}
          placeholder="search tools (fuzzy)"
          textColor={C.fg}
          backgroundColor={props.searchMode ? "#1e293b" : C.bg}
          placeholderColor={C.muted}
        />
      </box>
    </box>
  );
}

function Sidebar(props: { entries: SideEntry[]; sel: number; active: boolean; window: number }) {
  const { start, end } = computeWindow(props.entries.length, props.sel, props.window);
  const visible = props.entries.slice(start, end);
  return (
    <box
      width={26}
      flexDirection="column"
      border={["right"]}
      borderColor={C.border}
      paddingX={0}
      paddingY={0}
      backgroundColor={C.paneBg}
    >
      <text
        content=" Categories"
        fg={props.active ? C.accent : C.header}
        attributes={TextAttributes.BOLD}
      />
      {visible.map((entry, i) => {
        const idx = start + i;
        const isSel = idx === props.sel;
        const marker = isSel ? ">" : " ";
        return (
          <text
            key={entry.id ?? "__all__"}
            content={`${marker}${entry.name.padEnd(22)}${String(entry.count).padStart(3)}`}
            fg={isSel ? C.selFg : C.fg}
            bg={isSel ? C.selBg : undefined}
          />
        );
      })}
    </box>
  );
}

function ToolList(props: {
  items: Tool[];
  sel: number;
  active: boolean;
  window: number;
  total: number;
}) {
  const { start, end } = computeWindow(props.items.length, props.sel, props.window);
  const visible = props.items.slice(start, end);
  return (
    <box
      width={34}
      flexDirection="column"
      border={["right"]}
      borderColor={C.border}
      paddingX={0}
      paddingY={0}
      backgroundColor={C.paneBg}
    >
      <text
        content={` Tools ${props.items.length}/${props.total}`}
        fg={props.active ? C.accent : C.header}
        attributes={TextAttributes.BOLD}
      />
      {props.items.length === 0 ? (
        <text content="  (no matches)" fg={C.muted} />
      ) : (
        visible.map((t, i) => {
          const idx = start + i;
          const isSel = idx === props.sel;
          return (
            <text
              key={t.id}
              content={`${isSel ? ">" : " "} ${t.name}`.padEnd(32)}
              fg={isSel ? C.selFg : C.fg}
              bg={isSel ? C.selBg : undefined}
              attributes={isSel ? TextAttributes.BOLD : TextAttributes.NONE}
            />
          );
        })
      )}
    </box>
  );
}

function DetailPane(props: { tool: Tool | undefined; showAll: boolean; platform: Platform; detect: DetectResult | null }) {
  const paneProps: {
    flexGrow: number;
    flexDirection: "column";
    border: ("top" | "right" | "bottom" | "left")[];
    borderColor: string;
    paddingX: number;
    paddingY: number;
  } = {
    flexGrow: 1,
    flexDirection: "column",
    border: ["left"],
    borderColor: C.border,
    paddingX: 1,
    paddingY: 0,
  };
  if (!props.tool) {
    return (
      <box {...paneProps}>
        <text content=" Details" fg={C.header} attributes={TextAttributes.BOLD} />
        <box flexGrow={1} alignItems="center" justifyContent="center">
          <text content="No tool selected" fg={C.muted} />
        </box>
      </box>
    );
  }
  const t = props.tool;
  const cmds: InstallCommand[] = installCommands(t);
  const best = bestInstallCommand(t, props.platform);
  return (
    <box {...paneProps}>
      <text content=" Details" fg={C.header} attributes={TextAttributes.BOLD} />
      <text content={t.name} fg={C.accent} attributes={TextAttributes.BOLD} />
      <text content={t.url} fg={C.header} />
      <text
        content={`${catName(t.category)}${t.subcategory ? " / " + t.subcategory : ""}`}
        fg={C.dim}
      />
      {props.detect === null ? (
        <text content="  checking installed..." fg={C.dim} />
      ) : props.detect.installed ? (
        <text content={`  installed: yes (${props.detect.source})`} fg={C.green} />
      ) : (
        <text content={`  installed: no (${props.detect.source})`} fg={C.muted} />
      )}
      <text content=" " fg={C.fg} />
      <text content={t.description} fg={C.fg} />
      {t.binaries.length > 0 ? (
        <text content={`bin: ${t.binaries.join(", ")}`} fg={C.dim} />
      ) : null}
      <text content=" " fg={C.fg} />
      <text content=" Install" fg={C.header} attributes={TextAttributes.BOLD} />
      {best ? (
        <text content={`  $ ${best.command}`} fg={C.green} attributes={TextAttributes.BOLD} />
      ) : (
        <text content="  (no install command recorded)" fg={C.muted} />
      )}
      {props.showAll && cmds.length > 0 ? (
        <box flexDirection="column" paddingX={2}>
          {cmds.map((c) => (
            <text
              key={`${c.manager}:${c.command}`}
              content={`${c.manager.padEnd(11)} ${c.command}`}
              fg={C.fg}
            />
          ))}
        </box>
      ) : null}
      {!props.showAll && cmds.length > 0 ? (
        <text content="  press i to show all install commands" fg={C.muted} />
      ) : null}
    </box>
  );
}

function Footer(props: { status: string }) {
  return (
    <box
      flexDirection="column"
      border={["top"]}
      borderColor={C.border}
      paddingX={1}
      paddingY={0}
    >
      <text
        content={props.status || "select a tool and press Enter to copy its install command"}
        fg={props.status ? C.green : C.muted}
      />
      <box flexDirection="row" gap={2}>
        <text content="q quit" fg={C.muted} />
        <text content="/ search" fg={C.muted} />
        <text content="j/k move" fg={C.muted} />
        <text content="Tab panes" fg={C.muted} />
        <text content="Enter copy" fg={C.muted} />
        <text content="o open" fg={C.muted} />
        <text content="? help" fg={C.muted} />
      </box>
      <box flexDirection="row" gap={2}>
        <text content="e install" fg={C.muted} />
        <text content="u update" fg={C.muted} />
        <text content="x remove" fg={C.muted} />
        <text content="r run" fg={C.muted} />
        <text content="i all cmds" fg={C.muted} />
      </box>
    </box>
  );
}

function HelpOverlay() {
  const rows: Array<[string, string]> = [
    ["q / Ctrl+C", "quit"],
    ["j / down", "move selection down"],
    ["k / up", "move selection up"],
    ["g / G", "first / last item"],
    ["Tab", "next pane"],
    ["h / left", "previous pane"],
    ["l / right", "next pane"],
    ["/", "focus search"],
    ["Esc", "clear search"],
    ["Enter", "copy install command"],
    ["o", "open URL"],
    ["i", "toggle all install commands"],
    ["e", "install (execute)"],
    ["u", "update (execute)"],
    ["x", "remove (execute)"],
    ["r", "run / launch binary"],
    ["?", "close this help"],
  ];
  return (
    <box flexGrow={1} flexDirection="column" alignItems="center" justifyContent="center">
      <box
        flexDirection="column"
        border={true}
        borderColor={C.border}
        paddingX={2}
        paddingY={1}
      >
        <text content=" Just TUI it! - keys" fg={C.header} attributes={TextAttributes.BOLD} />
        <text content=" " fg={C.fg} />
        {rows.map(([key, desc]) => (
          <text key={key} content={`  ${key.padEnd(14)} ${desc}`} fg={C.fg} />
        ))}
        <text content=" " fg={C.fg} />
        <text content=" press any key to close" fg={C.muted} />
      </box>
    </box>
  );
}

function App() {
  const { height } = useTerminalDimensions();
  const termHeight = height > 0 ? height : 24;
  const renderer = useRenderer();

  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [pane, setPane] = useState<0 | 1 | 2>(1);
  const [catSel, setCatSel] = useState(0);
  const [toolSel, setToolSel] = useState(0);
  const [showAllInstall, setShowAllInstall] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [status, setStatus] = useState("");
  const [detect, setDetect] = useState<DetectResult | null>(null);
  const [busy, setBusy] = useState(false);

  const platform = useMemo(() => detectPlatform(), []);

  const sidebar = useMemo<SideEntry[]>(() => {
    const counts = new Map<string, number>();
    for (const t of tools) counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
    const entries: SideEntry[] = categories.map((c) => ({
      id: c.id,
      name: c.name,
      count: counts.get(c.id) ?? 0,
    }));
    return [{ id: null, name: "All", count: tools.length }, ...entries];
  }, []);

  const activeCategoryId = sidebar[catSel]?.id ?? null;

  const filtered = useMemo(() => {
    const q = search.trim();
    const scoped =
      activeCategoryId === null ? tools : tools.filter((t) => t.category === activeCategoryId);
    if (!q) return scoped;

    const scored: Array<{ tool: Tool; score: number }> = [];
    for (const t of scoped) {
      const m = scoreTool(q, t.name, t.id, t.binaries);
      if (m) scored.push({ tool: t, score: m.score });
    }
    scored.sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name));
    return scored.map((s) => s.tool);
  }, [search, activeCategoryId]);

  const selectedTool = filtered[toolSel];

  // Reset the tool selection whenever the filter changes (search or category).
  useEffect(() => {
    setToolSel(0);
  }, [search, activeCategoryId]);

  // Detect installed state for the selected tool.
  useEffect(() => {
    let cancelled = false;
    const t = selectedTool;
    if (!t) {
      setDetect(null);
      return;
    }
    setDetect(null);
    detectInstalled(t, platform)
      .then((r) => {
        if (!cancelled) setDetect(r);
      })
      .catch(() => {
        if (!cancelled) setDetect({ installed: false, source: "error", command: "" });
      });
    return () => {
      cancelled = true;
    };
  }, [selectedTool?.id, platform]);

  // Transient status message.
  useEffect(() => {
    if (!status) return;
    const id = setTimeout(() => setStatus(""), 5000);
    return () => clearTimeout(id);
  }, [status]);

  // Row budget for the windowed lists (header 3 + footer 4 + pane title 1).
  const listWindow = Math.max(1, termHeight - 8);

  const runAction = (verb: string, command: string | undefined, name: string) => {
    if (busy) return;
    if (!command) {
      setStatus(`No ${verb} command for ${name}`);
      return;
    }
    setBusy(true);
    setStatus(`${verb} ${name}...`);
    runInTerminal(renderer, command).then((outcome) => {
      setBusy(false);
      if (outcome.ok) setStatus(`${verb} ${name} done (exit 0)`);
      else if (outcome.error) setStatus(`${verb} failed: ${outcome.error}`);
      else setStatus(`${verb} ${name} failed (exit ${outcome.code ?? outcome.signal ?? "?"})`);
    });
  };

  useKeyboard((e) => {
    if (e.name === "c" && e.ctrl) {
      process.exit(0);
      return;
    }
    if (e.name === "q") {
      process.exit(0);
      return;
    }

    // Search mode: capture text, backspace, Esc (clear + leave), Enter (leave).
    if (searchMode) {
      if (e.name === "escape") {
        setSearch("");
        setSearchMode(false);
        return;
      }
      if (e.name === "enter") {
        setSearchMode(false);
        return;
      }
      if (e.name === "backspace") {
        setSearch((s) => s.slice(0, -1));
        return;
      }
      if (e.ctrl || e.meta) return;
      const ch = charForKey(e);
      if (ch !== null) setSearch((s) => s + ch);
      return;
    }

    if (e.name === "?") {
      setShowHelp((s) => !s);
      return;
    }
    if (showHelp) {
      setShowHelp(false);
      return;
    }

    switch (e.name) {
      case "/":
        setSearchMode(true);
        break;
      case "tab":
        setPane((p) => ((p + 1) % 3) as 0 | 1 | 2);
        break;
      case "h":
      case "left":
        setPane((p) => ((p + 2) % 3) as 0 | 1 | 2);
        break;
      case "l":
      case "right":
        setPane((p) => ((p + 1) % 3) as 0 | 1 | 2);
        break;
      case "j":
      case "down":
        if (pane === 0) setCatSel((c) => clamp(c + 1, 0, sidebar.length - 1));
        else setToolSel((t) => clamp(t + 1, 0, filtered.length - 1));
        break;
      case "k":
      case "up":
        if (pane === 0) setCatSel((c) => clamp(c - 1, 0, sidebar.length - 1));
        else setToolSel((t) => clamp(t - 1, 0, filtered.length - 1));
        break;
      case "g":
        if (pane === 0) setCatSel(0);
        else setToolSel(0);
        break;
      case "G":
        if (pane === 0) setCatSel(sidebar.length - 1);
        else setToolSel(Math.max(0, filtered.length - 1));
        break;
      case "enter": {
        const t = filtered[toolSel];
        if (!t) {
          setStatus("No tool selected");
          break;
        }
        const best = bestInstallCommand(t, platform);
        if (!best) {
          setStatus(`No install command recorded for ${t.name}`);
          break;
        }
        const ok = copyToClipboard(best.command);
        setStatus(ok ? `Copied: ${best.command}` : `Install command: ${best.command}`);
        break;
      }
      case "o": {
        const t = filtered[toolSel];
        if (!t) {
          setStatus("No tool selected");
          break;
        }
        openUrl(t.url);
        setStatus(`Opening ${t.url}`);
        break;
      }
      case "i":
        setShowAllInstall((s) => !s);
        break;
      case "e": {
        const t = filtered[toolSel];
        if (!t) {
          setStatus("No tool selected");
          break;
        }
        runAction("install", bestCommand(t, "install", platform)?.command, t.name);
        break;
      }
      case "u": {
        const t = filtered[toolSel];
        if (!t) {
          setStatus("No tool selected");
          break;
        }
        runAction("update", bestCommand(t, "update", platform)?.command, t.name);
        break;
      }
      case "x": {
        const t = filtered[toolSel];
        if (!t) {
          setStatus("No tool selected");
          break;
        }
        runAction("remove", bestCommand(t, "remove", platform)?.command, t.name);
        break;
      }
      case "r": {
        const t = filtered[toolSel];
        if (!t) {
          setStatus("No tool selected");
          break;
        }
        const bin = t.binaries[0];
        if (!bin) {
          setStatus(`No binary to launch for ${t.name}`);
          break;
        }
        runAction("launch", bin, t.name);
        break;
      }
      case "escape":
        setSearch("");
        break;
      default:
        break;
    }
  });

  return (
    <box flexDirection="column" flexGrow={1} backgroundColor={C.bg}>
      <Header search={search} searchMode={searchMode} />
      {showHelp ? (
        <HelpOverlay />
      ) : (
        <box flexDirection="row" flexGrow={1}>
          <Sidebar entries={sidebar} sel={catSel} active={pane === 0} window={listWindow} />
          <ToolList
            items={filtered}
            sel={toolSel}
            active={pane === 1}
            window={listWindow}
            total={tools.length}
          />
          <DetailPane tool={selectedTool} showAll={showAllInstall} platform={platform} detect={detect} />
        </box>
      )}
      <Footer status={status} />
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
