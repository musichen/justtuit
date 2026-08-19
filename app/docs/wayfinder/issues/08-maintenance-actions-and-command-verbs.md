# Maintenance action keybindings and command verbs

Type: grilling
Status: resolved

## Question

Piece 4 needs keys and command mappings for the four maintenance actions
(install / update / remove / launch). Ticket 02 resolved *that* we execute, but
not the exact keys, nor how update/remove commands are derived per manager.

## Answer

Keys (single letters; shown in the footer and `?` help):

- `i` install - execute the best install command
- `u` update - execute the best update command
- `x` remove - execute the best remove command
- `r` run / launch - launch the tool's first binary
- `a` toggle all install commands (moved from `i`)
- `Enter` stays copy-to-clipboard (secondary affordance, per ticket 02)

`i` was chosen for install (more intuitive than `e`). Note: while search mode is
active (after `/`), single letters type into the search box; `Esc`/`Enter` returns
to command mode where the letters act as shortcuts.

Verbs: `src/install.ts` gains `type Verb = "install" | "update" | "remove"` and
per-manager builders, exposed as `commandsFor(tool, verb)` and
`bestCommand(tool, verb, platform)`. Managers that lack a verb (e.g. `go` has no
remove command) simply omit it. Update/remove mappings:

- brew: `brew upgrade <id>` / `brew uninstall <id>`
- apt: `sudo apt install --only-upgrade <id>` / `sudo apt remove <id>`
- dnf: `sudo dnf upgrade <id>` / `sudo dnf remove <id>`
- pacman: `sudo pacman -S <id>` (reinstall) / `sudo pacman -R <id>`
- cargo: `cargo install <id> --force` / `cargo uninstall <id>`
- go: `go install <id>@latest` (no remove)
- npm: `npm update -g <id>` / `npm uninstall -g <id>`
- pipx: `pipx upgrade <id>` / `pipx uninstall <id>`
- scoop/winget/choco: `<mgr> upgrade <id>` / `<mgr> uninstall <id>`

Launch uses the tool's first `binaries[]` entry (best-effort: the registry's
binary slug is not always the installed binary name - a data-quality follow-up,
not a blocker).
