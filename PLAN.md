# Just TUI it! - Implementation Plan

A cross-platform TUI (React + OpenTUI) that is itself "a TUI for TUI tools":
browse, search, and get install commands for every tool in the
[justtuit](https://github.com/musichen/justtuit) curated list.

## Stack

- `@opentui/core` + `@opentui/react` (native Zig core, React reconciler)
- `react` 19
- Runs under Bun (OpenTUI FFI is Bun-only). `bin/justtuit` is a Node shim that
  locates Bun and delegates.

## Current state

- `src/registry/types.ts` - `Tool`, `Category`, `Managers`, `Platform` types.
- `src/registry/tools.ts` - auto-generated: `categories` (13) + `tools` (672).
- `src/registry/curated.ts` - `curated: Record<string, Managers>` keyed by
  lowercased display name (77 entries). Regenerate tools.ts with:
  `bun scripts/parse-list.ts`.
- `src/index.tsx` - CLI introspection mode + placeholder TUI.
- `bin/justtuit` - Node -> Bun launcher.

## Contracts

### 1. `src/install.ts` (installer)

Pure TypeScript, no OpenTUI import. Exact public API:

```ts
import type { Tool, Platform } from "./registry/types.js";

export interface InstallCommand {
  manager: string;   // "Homebrew" | "cargo" | "npm" | "pipx" | "APT" | "DNF" | "pacman" | "Scoop" | "Winget" | "Chocolatey"
  command: string;   // full shell command, e.g. "brew install btop"
  platform: Platform; // "macos" | "linux" | "windows"
}

export function detectPlatform(): Platform;          // darwin->macos, win32->windows, else linux
export function installCommands(tool: Tool): InstallCommand[];          // all, sorted by preference
export function bestInstallCommand(tool: Tool, platform?: Platform): InstallCommand | null;
export function commandsByManager(tool: Tool): InstallCommand[];        // grouped, all platforms
```

Manager -> command / platforms:

| field  | command                   | platforms                |
|--------|---------------------------|--------------------------|
| brew   | `brew install <id>`       | macos, linux             |
| apt    | `sudo apt install <id>`   | linux                    |
| dnf    | `sudo dnf install <id>`   | linux                    |
| pacman | `sudo pacman -S <id>`     | linux                    |
| cargo  | `cargo install <id>`      | macos, linux, windows    |
| go     | `go install <id>@latest`  | macos, linux, windows    |
| npm    | `npm install -g <id>`     | macos, linux, windows    |
| pip    | `pipx install <id>`       | macos, linux, windows    |
| scoop  | `scoop install <id>`      | windows                  |
| winget | `winget install <id>`     | windows                  |
| choco  | `choco install <id>`      | windows                  |

Preference order (bestInstallCommand):
- macos: brew, cargo, go, npm, pip
- linux: brew, apt, dnf, pacman, cargo, go, npm, pip
- windows: winget, scoop, choco, cargo, go, npm, pip

### 2. Interactive UI (`src/index.tsx`)

Keep the existing CLI mode (`--count`, `--categories`, `--list`, `--help`) at
the top, before the renderer is created.

Three-pane layout:
- Header: title + search input.
- Left: category sidebar (13 categories + per-category count).
- Middle: tool list (filtered, windowed for scrolling).
- Right: detail pane (name, url, description, category, binaries, install commands).
- Footer: key hints.

Keybindings:
- `q` / `Ctrl+C` quit
- `j`/`k` or `down`/`up` move selection in active list
- `g`/`G` first/last
- `Tab` cycle pane (categories -> tools -> detail)
- `h`/`left` prev pane, `l`/`right` next pane
- `/` focus search; type to filter; `Esc` clear search
- `Enter` copy best install command for selected tool (print + attempt clipboard)
- `o` open URL (`open`/`xdg-open`/`start`)
- `i` show all install commands in detail pane
- `?` toggle help overlay

List rendering: render a window of the filtered tools around the cursor
(manual offset), do not depend on ScrollBox refs for the MVP.

OpenTUI React facts:
- `createCliRenderer`, `TextAttributes` from `@opentui/core`.
- `createRoot`, `useKeyboard` from `@opentui/react`.
- JSX elements are lowercase: `box`, `text`, `input`, `select`, `scrollbox`.
- `box` props: `flexDirection`, `alignItems`, `justifyContent`, `flexGrow`,
  `width`, `height`, `padding`, `paddingX`, `paddingY`, `gap`, `border`
  (boolean or array of sides e.g. `["bottom"]`), `borderColor`,
  `backgroundColor`, `title`.
- `text` props: `content`, `fg`, `bg`, `attributes` (TextAttributes.BOLD).
- `input` props: `value`, `placeholder`, `focused`, `onChange`.
- `useKeyboard((e) => { ... })` receives a KeyEvent with `name`, `ctrl`,
  `shift`, `meta`, `repeated`. Names like "j", "k", "q", "up", "down",
  "enter", "escape", "tab", "/".

### 3. Registry enrichment (`src/registry/curated.ts`)

Grow curated install managers toward ~150-200 well-known tools (currently 77).
Keys are lowercased display names and MUST match a tool name in
`src/registry/tools.ts` exactly. After editing run `bun scripts/parse-list.ts`
to regenerate tools.ts; fix any new "did not match" warnings. Only add managers
you are confident are real package/formula/registry identifiers.

## Verification

- Type-check: `npx tsc --noEmit`.
- CLI mode (no TTY): `node bin/justtuit --count`, `--list`, `--help`.
- Interactive smoke test: run in a PTY with a timeout (never a plain shell -
  a TUI blocks a plain shell forever).
