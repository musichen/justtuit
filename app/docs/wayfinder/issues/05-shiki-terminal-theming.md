# Shiki themes for terminal rendering

Type: research
Status: resolved

## Question

How should `justtuit` adopt Shiki themes for a terminal TUI?

## Answer

- **Now**: use OpenTUI's built-in theme/colour support with a small switchable
  set of palettes - at minimum **dark**, **colorful**, and **light** - toggled at
  runtime.
- **Later**: map Shiki theme JSON palettes to terminal colours as an enhancement
  (research how OpenTUI exposes theming first; if trivial, add Shiki immediately).

Piece 7 ships the palette switcher; Shiki palette import is a follow-up.
