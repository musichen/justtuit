# AGENTS.md - justtuit

A cross-platform TUI (React + OpenTUI) that is a "TUI for TUI tools": browse,
search, detect, install/update/remove, launch, and favourite terminal apps.

## Planning / Agent skills

This repo uses the **Wayfinder** planning methodology with a **local-markdown
issue tracker** rooted in `docs/` (no GitHub issues).

- **Issue tracker**: markdown files under `docs/`. See `docs/agents/issue-tracker.md`.
- **Decision map** (Wayfinder): `docs/wayfinder/map.md` - the destination,
  decisions so far, and open decision tickets under `docs/wayfinder/issues/`.
- **Roadmap**: `docs/roadmap.md` - the whole plan (pieces P0-P9, status, blockers).
- **Spec / contracts**: `PLAN.md` - technical contracts (installer API, UI
  keybindings, registry model).

When planning or implementing, read `docs/wayfinder/map.md` first, then the
roadmap and `PLAN.md`. Record new decisions as tickets under
`docs/wayfinder/issues/` and update the map's Decisions-so-far.

## Key facts (do not rediscover)

- **Runtime is Bun-only** (OpenTUI's native FFI has no Node backend). `bin/justtuit`
  is a Node shim that locates Bun and delegates.
- **Registry** is auto-generated: `src/registry/tools.ts` from
  `src/registry/source/list.md` + `src/registry/curated.ts`. Regenerate with
  `bun scripts/parse-list.ts` after editing `curated.ts`.
- **JSX** uses `@opentui/react` (`jsxImportSource`); elements are lowercase
  (`box`, `text`, `input`, `select`, `scrollbox`).
- **Verification**: `npx tsc --noEmit`; CLI mode `node bin/justtuit --count`;
  interactive tests only in a PTY with a timeout (a TUI blocks a plain shell).

## Install / dev

```bash
bun install            # or npm install
npm run dev            # run the TUI directly under Bun
node bin/justtuit --help
```
