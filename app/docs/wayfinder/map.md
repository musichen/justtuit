# Wayfinder map: justtuit

## Destination

A fully charted path to a **published, feature-complete `justtuit`**: every
blocking decision resolved, so the remaining build pieces (P4-P9 in
[`docs/roadmap.md`](../roadmap.md)) can be executed without ambiguity. Reaching
the end means the `justtuit` TUI is installable via `npm i -g` / `npx`, the
`justtuit.github.io` site is live, and the TUI browses/searchs/detects/
installs/updates/removes/launches/favourites the full 672-tool registry.

## Notes

- **Domain**: terminal user interfaces; a launcher/maintenance tool for TUI apps.
- **Stack** (decided): `@opentui/core` + `@opentui/react` (React 19), Bun runtime
  (`bin/justtuit` Node shim delegates to Bun). See `PLAN.md`.
- **Skills to consult**: `wayfinder` (this map), `grilling`, `domain-modeling`,
  `research`, `prototype`, `to-spec`/`to-tickets` (SDD), `tdd`, `axi`.
- **Tracker**: local markdown in `docs/` — see `docs/agents/issue-tracker.md`.
- **Standing preferences**: publish piece by piece (each piece independently
  shippable); verify interactive work in a PTY, never a plain shell; prioritize
  quality/simplicity/robustness over dev cost.

## Decisions so far

These were made before ticketizing (recorded in `PLAN.md` / `README.md`, not as
closed tickets) and are treated as settled:

- **Stack** — React 19 + OpenTUI (`@opentui/core`/`@opentui/react`), Bun-only FFI.
- **Distribution** — npm package with a Node→Bun launcher `bin`; `npx`/`npm i -g`.
- **Registry** — auto-generated `tools.ts` from `source/list.md` + hand-curated
  `curated.ts` install managers.
- **Install command model** — `Managers` identifiers → `src/install.ts` command
  builder (`detectPlatform`, `installCommands`, `bestInstallCommand`).
- **UI layout** — three-pane (category sidebar / tool list / detail), plus a
  preserved CLI introspection mode (`--count`, `--categories`, `--list`).
- **Tracker layout** — local markdown rooted in `docs/` (this decision).

Resolved via decision tickets (see `issues/` for detail):

- [Package name and npm scope](issues/01-package-name-and-npm-scope.md) — `justtuit`
  (unscoped) + `@webboxes/justtuit` org alias; binary `justtuit`; `npm i justtuit -g`.
- [Execution model: copy vs execute](issues/02-execution-model-copy-vs-execute.md) —
  **execute** install/update/remove/launch (suspend/restore the renderer).
- [Install detection strategy](issues/03-install-detection-strategy.md) — query the
  first/best offered manager (brew/apt/pacman/winget/scoop) + binary-probe fallback.
- [Favourites persistence](issues/04-favourites-persistence.md) — `~/.justtuit/favourites.json`.
- [Shiki → terminal theming](issues/05-shiki-terminal-theming.md) — OpenTUI built-in
  themes now (dark/colorful/light), Shiki palettes later.
- [Website and hosting](issues/06-website-and-hosting.md) — Alpine.js + Tailwind (CDN),
  GitHub Pages, Actions export → gh-pages from a `site/` folder.
- [Repo layout](issues/07-repo-layout-package-and-site.md) — monorepo at
  `musichen/justtuit` (package in a subfolder, site in `site/`).
- [Maintenance action keybindings and command verbs](issues/08-maintenance-actions-and-command-verbs.md) —
  `e`/`u`/`x`/`r` keys; `Verb`-aware command builder (install/update/remove per manager).
- [Fuzzy search algorithm](issues/09-fuzzy-search-algorithm.md) — fzy-style
  subsequence matcher with scoring, no hard threshold, name/id/binary fields.
- [Session management backend](issues/10-session-management.md) — tmux as the
  session backend: `r` launch+attach, `S` sessions view, detach/reattach/kill.

## Not yet specified

Fog that is in scope but not yet sharp enough to ticket:

## Out of scope

- **Native single-binary packaging** (`bun build --compile`) — ruled out in
  favour of the npm + Bun-shim distribution already built.
- **A GUI/web renderer of the TUI itself** — the website is a static catalog,
  not an interactive port of the app.
- **Auto-syncing the registry from upstream** — regeneration is manual
  (`bun scripts/parse-list.ts`) for now.
