/**
 * Registry data model for Just TUI it!
 *
 * The registry is generated from the canonical tool list (src/registry/source/list.md)
 * plus a curated map of package-manager install identifiers (src/registry/curated.ts).
 */

export type Platform = "macos" | "linux" | "windows";

/**
 * Package-manager-specific install identifiers for a tool.
 *
 * Each field is the identifier that manager expects (a formula name, package
 * name, crate name, Go module path, etc.), not the full command. The command
 * builder (installer piece) turns these into concrete commands per platform.
 */
export interface Managers {
  /** Homebrew formula (macOS + Linux). */
  brew?: string;
  /** Debian / Ubuntu APT package name. */
  apt?: string;
  /** Fedora / RHEL DNF package name. */
  dnf?: string;
  /** Arch Linux pacman package name. */
  pacman?: string;
  /** crates.io crate name (`cargo install <name>`). */
  cargo?: string;
  /** Go module path (`go install <path>@latest`). */
  go?: string;
  /** npm package name (`npm i -g <name>`). */
  npm?: string;
  /** PyPI package name (`pipx install <name>`). */
  pip?: string;
  /** Scoop package (Windows). */
  scoop?: string;
  /** Winget package id (Windows). */
  winget?: string;
  /** Chocolatey package (Windows). */
  choco?: string;
}

export interface Tool {
  /** Stable slug used as the registry key. */
  id: string;
  /** Display name. */
  name: string;
  /** Homepage / repository URL. */
  url: string;
  /** One-line description. */
  description: string;
  /** Category slug. */
  category: string;
  /** Optional subcategory (e.g. "python", "go" under Libraries). */
  subcategory?: string;
  /**
   * Candidate command names used to detect whether the tool is installed.
   * Empty for libraries / non-executable entries.
   */
  binaries: string[];
  /** Package-manager install identifiers ({} = not yet recorded). */
  managers: Managers;
}

export interface Category {
  id: string;
  name: string;
}
