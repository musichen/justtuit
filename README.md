# Just TUI it!

> A colorful TUI for TUI tools. Browse, install, update, launch and uninstall
> terminal applications from one keyboard-driven interface.

## Install

```bash
npm install -g justtuit
# or, without installing:
npx justtuit
```

Just TUI it! is built on [OpenTUI](https://github.com/anomalyco/opentui) + React.
OpenTUI's native core runs under [Bun](https://bun.sh), so Bun is required at
runtime. If Bun is missing, the launcher prints a one-line install instruction.

```bash
curl -fsSL https://bun.sh/install | bash
```

## Run

```bash
justtuit
```

Keys (current skeleton):

- `q` or `Ctrl+C` - quit

## Status

This is an early skeleton. Upcoming pieces:

1. Tool registry (categories + per-platform install commands)
2. Category sidebar + tool list + detail pane
3. Install detection, install/update/uninstall/launch
4. Fuzzy search
5. Favourites quick-launch bar
6. Shiki themes and polish
7. `justtuit.github.io` site

## License

MIT
