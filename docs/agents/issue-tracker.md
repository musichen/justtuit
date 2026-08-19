# Issue tracker: Local Markdown (rooted in `docs/`)

This repo tracks issues and specs as markdown files under `docs/`. There is no
remote/issue-tracker integration (the repo has no `git remote`); this is the
local-markdown tracker, adapted from the default `.scratch/` convention so that
all planning artifacts live in one visible `docs/` folder as requested.

## Conventions

- One effort per directory: `docs/<effort-slug>/`
- The planning **map** for an effort is `docs/<effort-slug>/map.md`
- Decision tickets are one file per ticket at `docs/<effort-slug>/issues/<NN>-<slug>.md`,
  numbered from `01` — never a single combined tickets file
- Ticket state is recorded as a `Status:` line near the top of each file
- Conversation history appends to the bottom of a file under a `## Comments` heading

## Wayfinding operations

Used by the Wayfinder methodology. The **map** is a file with one **child**
file per ticket.

- **Map**: `docs/<effort>/map.md` — the Notes / Decisions-so-far / fog body.
- **Child ticket**: `docs/<effort>/issues/NN-<slug>.md`, numbered from `01`, with
  the question in the body. A `Type:` line records the ticket type
  (`research` / `prototype` / `grilling` / `task`); a `Status:` line records
  `open` / `claimed` / `resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked
  when every file it lists is `resolved`.
- **Frontier**: scan `docs/<effort>/issues/` for files that are `open`,
  unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set
  `Status: resolved`, then append a context pointer (gist + link) to the map's
  Decisions-so-far in `map.md`.

## This repo's effort

The active effort is **justtuit** — see `docs/roadmap.md` for the global plan
and `docs/wayfinder/map.md` for the decision map.
