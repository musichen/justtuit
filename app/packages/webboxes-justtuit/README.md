# @webboxes/justtuit

> The web-boxes.com alias of [justtuit](https://www.npmjs.com/package/justtuit) - a TUI for TUI tools.

**justtuit** is a cross-platform terminal UI that catalogs **672 terminal apps
across 13 categories** and turns them into copy-paste install commands for your
platform's package manager (Homebrew, APT, DNF, pacman, cargo, npm, pipx, Winget,
Scoop, and more).

## Install

```bash
npm install -g @webboxes/justtuit
```

This package depends on `justtuit` and exposes the same `justtuit` binary.

## Run

```bash
justtuit
```

Built on [OpenTUI](https://github.com/anomalyco/opentui) + React. OpenTUI's native
core runs under [Bun](https://bun.sh), so Bun is required at runtime. The launcher
auto-detects Bun and prints guidance if it is missing:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Learn more

- Main package: [justtuit](https://www.npmjs.com/package/justtuit)
- Source + full docs: [github.com/musichen/justtuit](https://github.com/musichen/justtuit)
