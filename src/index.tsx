import { createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import { categories, tools } from "./registry/tools.js";
import type { Tool } from "./registry/types.js";

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
  border: "#334155",
  header: "#38bdf8",
  accent: "#22d3ee",
  fg: "#e2e8f0",
  muted: "#64748b",
};

function Header() {
  return (
    <box
      flexDirection="row"
      alignItems="center"
      border={["bottom"]}
      borderColor={C.border}
      paddingX={1}
      paddingY={0}
    >
      <text content="Just TUI it!" fg={C.header} attributes={TextAttributes.BOLD} />
      <text content="  a TUI for TUI tools" fg={C.muted} />
    </box>
  );
}

function Footer() {
  return (
    <box
      flexDirection="row"
      border={["top"]}
      borderColor={C.border}
      paddingX={1}
      paddingY={0}
      gap={2}
    >
      <text content="q / Ctrl+C  quit" fg={C.muted} />
    </box>
  );
}

function App() {
  useKeyboard((e) => {
    if ((e.name === "c" && e.ctrl) || e.name === "q") process.exit(0);
  });

  return (
    <box flexDirection="column" flexGrow={1} backgroundColor={C.bg}>
      <Header />
      <box flexGrow={1} alignItems="center" justifyContent="center">
        <box flexDirection="column" alignItems="center" gap={1}>
          <text content="Piece 2 - registry loaded" fg={C.accent} attributes={TextAttributes.BOLD} />
          <text content={`${tools.length} tools across ${categories.length} categories`} fg={C.fg} />
          <text content="Sidebar, detail pane and search land in the next pieces." fg={C.muted} />
        </box>
      </box>
      <Footer />
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
