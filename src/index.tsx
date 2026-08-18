import { createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";

// Palette (Slate + Sky accents).
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
          <text content="Piece 1 - skeleton" fg={C.accent} attributes={TextAttributes.BOLD} />
          <text content="Registry, search and favourites land in the next pieces." fg={C.fg} />
        </box>
      </box>
      <Footer />
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
