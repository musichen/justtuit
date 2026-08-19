# Just TUI it!

> A TUI for TUI tools. Browse, search, and get install commands for every
> terminal application in the [justtuit](https://github.com/musichen/justtuit)
> curated list, from one keyboard-driven interface.

Just TUI it! is a cross-platform terminal UI that catalogs **672 terminal apps
across 13 categories** and turns them into copy-paste install commands for the
package manager on your platform (Homebrew, APT, DNF, pacman, cargo, npm, pipx,
Winget, Scoop, and more).

## Install

Install globally with npm:

```bash
npm install -g justtuit
# or run it without installing:
npx justtuit
```

Just TUI it! is built on [OpenTUI](https://github.com/anomalyco/opentui) + React.
OpenTUI's native core runs under [Bun](https://bun.sh), so **Bun is required at
runtime**. The `justtuit` launcher auto-detects Bun and prints guidance if it is
missing. Install Bun with:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Quick start

```bash
justtuit
```

Non-interactive CLI flags (these print and exit, so they also work in scripts
and CI without a terminal):

| Flag                  | Description                                      |
|-----------------------|--------------------------------------------------|
| `justtuit --count`    | Print the number of tools and categories         |
| `justtuit --categories` | List all categories                           |
| `justtuit --list [cat]` | List tools, optionally filtered by category slug |
| `justtuit --help`     | Show usage help                                  |

## Keybindings

| Key              | Action                                              |
|------------------|-----------------------------------------------------|
| `q` / `Ctrl+C`   | Quit                                                |
| `j` / `k` or `down` / `up` | Move selection in the active list         |
| `g` / `G`        | Jump to first / last item                           |
| `Tab`            | Cycle pane (categories -> tools -> detail)          |
| `h` / `left`     | Previous pane                                       |
| `l` / `right`    | Next pane                                           |
| `/`              | Focus search; type to filter; `Esc` clears search   |
| `Enter`          | Copy the best install command for the selected tool |
| `o`              | Open the tool's URL (`open` / `xdg-open` / `start`) |
| `i`              | Show all install commands in the detail pane        |
| `?`              | Toggle the help overlay                             |

## Features

- **Registry of 672 tools across 13 categories** - dashboards, development,
  editors, file managers, games, libraries, messaging, multimedia,
  productivity, web, and more.
- **Fuzzy search** - filter tools by name as you type.
- **Three-pane layout** - category sidebar, filtered tool list, and a detail
  pane (name, URL, description, category, binaries, install commands).
- **Per-platform install commands** - a command builder maps each tool's
  package identifiers to concrete commands for your platform (macOS, Linux,
  Windows) using the right manager:

  | Manager     | Command                    | Platforms               |
  |-------------|----------------------------|-------------------------|
  | Homebrew    | `brew install <id>`        | macOS, Linux            |
  | APT         | `sudo apt install <id>`    | Linux                   |
  | DNF         | `sudo dnf install <id>`    | Linux                   |
  | pacman      | `sudo pacman -S <id>`      | Linux                   |
  | cargo       | `cargo install <id>`       | macOS, Linux, Windows   |
  | go          | `go install <id>@latest`   | macOS, Linux, Windows   |
  | npm         | `npm install -g <id>`      | macOS, Linux, Windows   |
  | pipx        | `pipx install <id>`        | macOS, Linux, Windows   |
  | Scoop       | `scoop install <id>`       | Windows                 |
  | Winget      | `winget install <id>`      | Windows                 |
  | Chocolatey  | `choco install <id>`       | Windows                 |
- **Copy / open** - copy the best install command to your clipboard, or open a
  tool's homepage directly from the TUI.

## Architecture

- **React + OpenTUI** - the UI is React 19 rendered by
  [`@opentui/react`](https://github.com/anomalyco/opentui), whose native core is
  written in Zig.
- **`bin/justtuit`** - a thin Node shim that locates Bun and delegates to it, so
  `npm i -g justtuit` and `npx justtuit` work without manually prefixing every
  command with `bun`.
- **`src/registry/*`** - the data layer:
  - `types.ts` - `Tool`, `Category`, `Managers`, and `Platform` types.
  - `tools.ts` - auto-generated registry (`categories` + `tools`).
  - `curated.ts` - a hand-maintained map of display names to per-manager install
    identifiers.
  - `source/list.md` - the canonical markdown source of the tool list.
- **`src/install.ts`** - the pure-TypeScript command builder
  (`detectPlatform`, `installCommands`, `bestInstallCommand`,
  `commandsByManager`) that turns a tool's `Managers` into concrete shell
  commands.

## Development

```bash
# Regenerate src/registry/tools.ts from the canonical list + curated map
bun scripts/parse-list.ts

# Type-check
npx tsc --noEmit

# Run the TUI in dev mode (uses Bun directly)
npm run dev
```

## License

[MIT](LICENSE)

This tool is a front-end for the curated list at
<https://github.com/musichen/justtuit>.
