# Install detection strategy

Type: research
Status: resolved

## Question

How should `justtuit` determine whether a tool is already installed?

## Answer

Keep it simple: **use the first/best offered install method's manager** to query
installed state, with a binary probe (`which` / `command -v`) as fallback.

- macOS: `brew list --formula <id>` (or binary probe if no brew entry).
- Linux: `dpkg -s <id>` / `pacman -Q <id>` / `dnf list installed <id>` for the
  first offered apt/pacman/dnf entry, else binary probe.
- Windows: `winget list <id>` / `scoop list <id>`, else `where <binary>`.

Detection reuses `bestInstallCommand(tool, platform)` to pick the manager; the
registry's `binaries` array supplies the fallback probe names. No new registry
fields required beyond what exists.
