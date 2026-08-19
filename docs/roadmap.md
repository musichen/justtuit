# Just TUI it! - Global Roadmap

A cross-platform TUI (React + OpenTUI) that is itself "a TUI for TUI tools":
browse, search, detect, install/update/remove, launch, and favourite every tool
in the [justtuit](https://github.com/musichen/justtuit) curated list (672 tools,
13 categories).

This is the plan of record. Technical contracts live in [`PLAN.md`](../PLAN.md);
decisions live in [`docs/wayfinder/map.md`](wayfinder/map.md) and its (resolved)
tickets.

## Status legend

- ✅ Done
- 🚧 In progress
- ⬜ Not started

## Pieces

| # | Piece | Status | Notes |
|---|-------|--------|-------|
| 0 | Stack + runtime decision (OpenTUI/React/Bun) | ✅ | OpenTUI FFI is Bun-only; `bin/justtuit` Node shim |
| 1 | Skeleton + launcher | ✅ | `package.json`, `bin/justtuit`, shell TUI |
| 2 | Registry (types, parser, curated install map) | ✅ | `src/registry/*`, 672 tools / 13 categories, **197** curated |
| 3 | Three-pane TUI + install command builder + CLI | ✅ | `src/index.tsx`, `src/install.ts`, `--count/--list/...` |
| 4 | Maintenance: detect + execute install/update/remove + launch | ✅ | 4a detect, 4b execute, 4c launch done (`src/detect.ts`, `src/execute.ts`) |
| 5 | Fuzzy search (fnf-style matcher) | ✅ | fzy-style subsequence matcher (`src/fuzzy.ts`), score-sorted, no hard threshold |
| 6 | Favourites quick-launch bar | ⬜ | Persist to `~/.justtuit/favourites.json` + pinned bar |
| 7 | Theming + visual polish | ⬜ | OpenTUI built-in themes (dark/colorful/light); Shiki later |
| 8 | Static site (GitHub Pages) | ⬜ | Alpine.js + Tailwind (CDN), served from a `site/` folder |
| 9 | Publish to npm + CI | ⬜ | `npm i justtuit -g` + `@webboxes/justtuit` alias |

All decisions for P4-P9 are resolved (tickets 01-07). Remaining work is
implementation, not decision-making.

## Piece 4 (the "maintenance tool") sub-steps

1. **Detection** — query the first/best offered install manager
   (`brew list`, `dpkg -s`, `pacman -Q`, `winget list`, `scoop list`) with a
   binary-probe fallback (`which` / `where`).
2. **Execute** — spawn install/update/remove, suspending the renderer to stream
   child output, then restore on exit; report non-zero exit codes.
3. **Launch** — spawn the tool's binary the same way (suspend/restore).
4. Show per-tool status (installed / not installed) in the detail pane, with the
   right action offered (install vs update vs remove vs launch).

## Definition of done

- `npm i -g justtuit` and `npx justtuit` both launch the TUI (plus
  `@webboxes/justtuit` alias published).
- The TUI browses/searches all 672 tools, detects installed state, executes
  install/update/remove/launch, and pins favourites.
- The GitHub Pages site is live from the monorepo's `site/` folder.

## Verification (every piece)

- Type-check: `npx tsc --noEmit`.
- CLI mode (no TTY): `node bin/justtuit --count`, `--list`, `--help`.
- Interactive smoke test in a PTY with a timeout (never a plain shell — a TUI
  blocks a plain shell forever).
- Regenerate registry after any `curated.ts` change: `bun scripts/parse-list.ts`.
