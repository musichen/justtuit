# Execution model: copy commands vs execute installs

Type: grilling
Status: resolved

## Question

Should the TUI execute maintenance actions, or only surface copy-paste commands?

## Answer

**Execute.** The TUI spawns install / update / remove / launch and suspends the
renderer to stream child output, then restores on exit. Copy-to-clipboard stays
as a secondary affordance.

Implementation notes (for Piece 4):
- Suspend the OpenTUI renderer, spawn the child with inherited stdio, wait, then
  restore.
- Handle non-zero exit codes and report them in the status line.
- `sudo`-driven commands (apt/dnf/pacman) run through the user's existing sudo
  prompt as normal.
