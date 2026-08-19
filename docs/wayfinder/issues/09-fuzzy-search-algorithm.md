# Fuzzy search algorithm

Type: grilling
Status: resolved

## Question

What matcher and threshold does the search box use (replacing the substring
filter), so P5 can be implemented deterministically?

## Answer

**fzy-style subsequence matcher** in `src/fuzzy.ts` (pure, no deps):

- Case-insensitive subsequence match: every query character must appear in the
  candidate, in order.
- Scoring per matched character: base bonus + start-of-string bonus + word
  boundary bonus (after space, `-`, `_`, `.`, `:`, `/` and camelCase
  transitions), minus a gap penalty for skipped characters.
- The highest-scoring alignment wins; `positions` are returned for later
  highlighting (P7).
- Results are sorted by score descending (name as tiebreak).
- A tool matches if its **name**, **id**, or any **binary** matches; the
  description is deliberately excluded (long, noisy). Best field score wins.

Threshold: **no hard cutoff**. Every subsequence match is kept and sorted by
score, so short queries rank many results but the best rise to the top; typing
more characters narrows naturally. (Verified: `btop` -> 3 results, `docker` ->
2, `lz` -> 13 lazy\* tools.)
