# Session management backend (launch / detach / reattach / kill)

Type: grilling
Status: resolved

## Question

How does `justtuit` launch a TUI tool so the user can run it, detach (leave it
running in the background), list running apps, re-attach, or kill it - the
"fast-resume / agent-deck" behaviour?

## Answer

**Use tmux as the session backend.** tmux is already a dependency of the user's
workflow (agent-deck uses it too) and provides robust detach/attach/kill/list for
free, instead of reimplementing a PTY manager with node-pty.

- Launch: `tmux new-session -d -s justtuit-<slug>-<n> <binary>` (detached).
- Attach: suspend the OpenTUI renderer and run `tmux attach -t <name>` (the user
  detaches with tmux's `C-b d`, which returns to justtuit).
- List: `tmux ls` filtered to `justtuit-*`; the tool is resolved from the slug in
  the session name (longest-slug prefix match).
- Kill: `tmux kill-session -t <name>`.

Keys:
- `r` launches the selected tool in a new tmux session and attaches.
- `S` toggles the sessions view (list running apps).
- In the sessions view: `j`/`k` move, `Enter` attach, `x` kill, `Esc` back.

The registry's `binaries[]` (real binary names, e.g. `spf` for superfile) supplies
the launch command. Multiple instances of the same tool are allowed via the `-<n>`
suffix. Favourites (`f` / `★ Favourites`) remain the pinned-app surface.
