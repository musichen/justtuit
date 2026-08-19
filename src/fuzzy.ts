/**
 * Fuzzy matcher (fzy-style): case-insensitive subsequence matching with scoring.
 *
 * Pure TypeScript, no dependencies. Used by the search box to rank tools by
 * relevance instead of a plain substring filter.
 *
 * Scoring (per matched character):
 *   - base bonus for every matched character
 *   - start-of-string bonus
 *   - word-boundary bonus (after space, -, _, ., :, / and camelCase transitions)
 *   - gap penalty for skipped characters between matches
 *
 * A match requires every query character to appear in the candidate, in order
 * (a subsequence match). The result is the highest-scoring alignment, with the
 * matched character positions for optional highlighting.
 */

export interface FuzzyMatch {
  /** Higher is a better match. */
  score: number;
  /** Candidate indices of the matched query characters (0-based). */
  positions: number[];
}

const SCORE_BASE = 100;
const SCORE_START = 50;
const SCORE_BOUNDARY = 30;
const GAP_COST = 5;

function isBoundary(candidate: string, idx: number): boolean {
  const prev = candidate[idx - 1]!;
  if (prev === " " || prev === "-" || prev === "_" || prev === "." || prev === ":" || prev === "/") {
    return true;
  }
  const cur = candidate[idx]!;
  // camelCase transition (lower -> upper).
  return prev >= "a" && prev <= "z" && cur >= "A" && cur <= "Z";
}

function charBonus(candidate: string, idx: number): number {
  if (idx === 0) return SCORE_BASE + SCORE_START;
  if (isBoundary(candidate, idx)) return SCORE_BASE + SCORE_BOUNDARY;
  return SCORE_BASE;
}

export function fuzzyMatch(query: string, candidate: string): FuzzyMatch | null {
  const q = query.toLowerCase();
  const c = candidate.toLowerCase();
  const N = c.length;
  const M = q.length;
  if (M === 0 || M > N) return null;

  const NEG = -Infinity;

  // prev[j] = best score matching the previous query chars, with the last
  // match ending at candidate index j-1 (j in 1..N). j = 0 means "before the
  // string". Only the empty prefix uses position 0.
  let prev: number[] = new Array(N + 1).fill(NEG);
  prev[0] = 0;

  // back[i][j] = the previous match position (k) for the chosen alignment, used
  // to reconstruct `positions`.
  const back: number[][] = [];

  for (let i = 0; i < M; i++) {
    const ch = q[i]!;
    const cur = new Array(N + 1).fill(NEG);
    const curBack = new Array(N + 1).fill(-1);
    let best = NEG;
    let bestK = -1;
    for (let j = 1; j <= N; j++) {
      // Bring prev[j-1] (previous match ending at j-2, or the start when j=1)
      // into the running maximum over k < j.
      const cand = prev[j - 1]! + (j - 1) * GAP_COST;
      if (cand > best) {
        best = cand;
        bestK = j - 1;
      }
      if (c[j - 1]! === ch) {
        cur[j] = charBonus(candidate, j - 1) + best - (j - 1) * GAP_COST;
        curBack[j] = bestK;
      }
    }
    back.push(curBack);
    prev = cur;
  }

  // Best alignment is the highest score over all ending positions.
  let end = -1;
  let bestScore = NEG;
  for (let j = 1; j <= N; j++) {
    if (prev[j]! > bestScore) {
      bestScore = prev[j]!;
      end = j;
    }
  }
  if (end === -1) return null;

  const positions: number[] = new Array(M);
  let j = end;
  for (let i = M - 1; i >= 0; i--) {
    positions[i] = j - 1;
    j = back[i]![j]!;
  }

  return { score: bestScore, positions };
}

/** Best fuzzy match across a tool's searchable fields, or null. */
export function scoreTool(query: string, name: string, id: string, binaries: readonly string[]): FuzzyMatch | null {
  let best: FuzzyMatch | null = null;
  const fields = [name, id, ...binaries];
  for (const text of fields) {
    const m = fuzzyMatch(query, text);
    if (m && (!best || m.score > best.score)) best = m;
  }
  return best;
}
