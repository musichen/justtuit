/**
 * Hand-curated binary-name overrides.
 *
 * The parser defaults a tool's binaries to its slug, but the actual installed
 * binary often differs (e.g. superfile's binary is `spf`, WTF's is `wtfutil`).
 * These entries override that default so detection, launch (`r`) and
 * search-by-binary use the real binary name.
 */
export const bins: Record<string, string[]> = {
  superfile: ["spf"],
  WTF: ["wtfutil"],
};
