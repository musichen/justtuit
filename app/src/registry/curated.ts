/**
 * Curated package-manager install identifiers for well-known tools.
 *
 * Keyed by the tool's display name (case-insensitive). The parser merges these
 * into the generated registry and reports any key that does not match a tool in
 * the list, so stale entries can be cleaned up.
 *
 * Each value is an identifier, not a full command. See `types.ts` for the
 * meaning of each manager field.
 */
import type { Managers } from "./types.js";

export const curated: Record<string, Managers> = {
  // ── Dashboards / monitoring ──────────────────────────────────────────────
  apachetop: { brew: "apachetop", apt: "apachetop" },
  atop: { brew: "atop", apt: "atop", dnf: "atop", pacman: "atop" },
  bandwhich: { brew: "bandwhich", cargo: "bandwhich", scoop: "bandwhich" },
  bashtop: { brew: "bashtop", apt: "bashtop", scoop: "bashtop" },
  below: { cargo: "below-view" },
  binsider: { brew: "binsider", cargo: "binsider" },
  bmon: { brew: "bmon", apt: "bmon", dnf: "bmon", pacman: "bmon" },
  "btop++": {
    brew: "btop",
    apt: "btop",
    dnf: "btop",
    pacman: "btop",
    cargo: "btop",
    scoop: "btop",
    winget: "aristocratos.btop4win",
  },
  bottom: { brew: "bottom", apt: "bottom", cargo: "bottom", scoop: "bottom", winget: "Clement.bottom" },
  bpytop: { brew: "bpytop", pip: "bpytop" },
  ctop: { brew: "ctop", apt: "ctop" },
  csysdig: { brew: "sysdig", apt: "sysdig" },
  damon: { brew: "hashicorp/tap/damon" },
  "gh-dash": { brew: "gh-dash", go: "github.com/dlvhdr/gh-dash" },
  Glances: { brew: "glances", apt: "glances", pip: "Glances", scoop: "glances" },
  goaccess: { brew: "goaccess", apt: "goaccess", dnf: "goaccess", pacman: "goaccess" },
  lazydocker: { brew: "lazydocker", go: "github.com/jesseduffield/lazydocker", scoop: "lazydocker" },
  nvtop: { brew: "nvtop", apt: "nvtop", dnf: "nvtop", pacman: "nvtop" },
  "s-tui": { pip: "s-tui" },
  zenith: { brew: "zenith", cargo: "zenith", scoop: "zenith" },

  // ── Editors ──────────────────────────────────────────────────────────────
  amp: { cargo: "amp" },
  helix: { brew: "helix", apt: "helix", cargo: "helix", scoop: "helix", winget: "Helix.Helix" },
  kakoune: { brew: "kakoune", apt: "kakoune" },
  micro: { brew: "micro", apt: "micro", scoop: "micro", winget: "zyedidia.micro" },

  // ── File managers ────────────────────────────────────────────────────────
  broot: { brew: "broot", cargo: "broot", scoop: "broot" },
  lf: { brew: "lf", apt: "lf", go: "github.com/gokcehan/lf", scoop: "lf" },
  nnn: { brew: "nnn", apt: "nnn", dnf: "nnn", pacman: "nnn" },
  ranger: { brew: "ranger", apt: "ranger", pip: "ranger-fm" },
  superfile: { brew: "yorukot/superfile/superfile", go: "github.com/yorukot/superfile" },
  vifm: { brew: "vifm", apt: "vifm" },
  xplr: { brew: "xplr", cargo: "xplr", scoop: "xplr" },
  yazi: { brew: "yazi", apt: "yazi", cargo: "yazi", scoop: "yazi", winget: "sxyazi.yazi" },

  // ── Productivity / dev tools ─────────────────────────────────────────────
  aerc: { brew: "aerc", apt: "aerc", go: "git.sr.ht/~rjarry/aerc" },
  calcurse: { brew: "calcurse", apt: "calcurse", dnf: "calcurse", pacman: "calcurse" },
  calcure: { pip: "calcure" },
  clipse: { brew: "clipse" },
  fjira: { brew: "fjira" },
  fzf: {
    brew: "fzf",
    apt: "fzf",
    dnf: "fzf",
    pacman: "fzf",
    scoop: "fzf",
    winget: "junegunn.fzf",
  },
  gitui: { brew: "gitui", apt: "gitui", cargo: "gitui", scoop: "gitui", winget: "extrawurst.gitui" },
  glow: { brew: "glow", apt: "glow", go: "github.com/charmbracelet/glow", scoop: "glow" },
  "hledger-ui": { brew: "hledger", apt: "hledger-ui" },
  khal: { brew: "khal", pip: "khal" },
  lazygit: {
    brew: "lazygit",
    apt: "lazygit",
    go: "github.com/jesseduffield/lazygit",
    scoop: "lazygit",
    winget: "JesseDuffield.lazygit",
  },
  mcfly: { brew: "mcfly", cargo: "mcfly", scoop: "mcfly" },
  mutt: { brew: "mutt", apt: "mutt", dnf: "mutt", pacman: "mutt" },
  patat: { brew: "patat", apt: "patat", cargo: "patat" },
  presenterm: { brew: "presenterm", cargo: "presenterm" },
  "sc-im": { brew: "sc-im", apt: "sc-im" },
  slides: { brew: "slides", go: "github.com/maaslalani/slides" },
  "taskwarrior-tui": { brew: "taskwarrior-tui", cargo: "taskwarrior-tui" },
  tmux: {
    brew: "tmux",
    apt: "tmux",
    dnf: "tmux",
    pacman: "tmux",
    scoop: "tmux",
    winget: "tmux.tmux",
  },
  todoman: { brew: "todoman", apt: "todoman", pip: "todoman" },
  "tui-deck": { go: "github.com/mebitek/tui-deck" },
  tuihub: { go: "github.com/ashis0013/tuihub" },
  visidata: { brew: "visidata", apt: "visidata", pip: "visidata" },
  zellij: { brew: "zellij", cargo: "zellij", scoop: "zellij", winget: "zellij.zellij" },

  // ── Messaging ────────────────────────────────────────────────────────────
  gomuks: { brew: "gomuks", go: "github.com/tulir/gomuks" },
  irssi: { brew: "irssi", apt: "irssi", dnf: "irssi", pacman: "irssi" },
  profanity: { brew: "profanity", apt: "profanity" },
  toot: { brew: "toot", pip: "toot" },
  weechat: { brew: "weechat", apt: "weechat", dnf: "weechat", pacman: "weechat", scoop: "weechat" },

  // ── Multimedia ───────────────────────────────────────────────────────────
  cmus: { brew: "cmus", apt: "cmus", dnf: "cmus", pacman: "cmus" },
  "mps-youtube": { pip: "mps-youtube" },
  ncspot: { brew: "ncspot", apt: "ncspot", cargo: "ncspot", scoop: "ncspot" },
  "spotify-player": { brew: "spotify-player", cargo: "spotify-player" },
  ytfzf: { brew: "ytfzf" },

  // ── Web ──────────────────────────────────────────────────────────────────
  bombadillo: { brew: "bombadillo", go: "git.sr.ht/~jasonwb/bombadillo" },
  browsh: { brew: "browsh", scoop: "browsh" },
  elinks: { brew: "elinks", apt: "elinks", dnf: "elinks", pacman: "elinks" },
  lynx: { brew: "lynx", apt: "lynx", dnf: "lynx", pacman: "lynx" },
  newsboat: { brew: "newsboat", apt: "newsboat", dnf: "newsboat", pacman: "newsboat" },
  rtorrent: { brew: "rtorrent", apt: "rtorrent", dnf: "rtorrent", pacman: "rtorrent" },
  slumber: { brew: "slumber", cargo: "slumber" },
  w3m: { brew: "w3m", apt: "w3m", dnf: "w3m", pacman: "w3m" },

  // ── Miscellaneous ────────────────────────────────────────────────────────
  gdu: { brew: "gdu", apt: "gdu", go: "github.com/dundee/gdu/v5/cmd/gdu", scoop: "gdu" },
  htop: { brew: "htop", apt: "htop", dnf: "htop", pacman: "htop", winget: "htop.htop" },
  ncdu: { brew: "ncdu", apt: "ncdu", dnf: "ncdu", pacman: "ncdu" },
  tig: { brew: "tig", apt: "tig", dnf: "tig", pacman: "tig" },

  // ── Dashboards / monitoring (additions) ─────────────────────────────────
  dolphie: { brew: "dolphie", pip: "dolphie" },
  gobang: { cargo: "gobang" },
  gotop: { brew: "gotop", scoop: "gotop" },
  gping: { brew: "gping", cargo: "gping", scoop: "gping" },
  hwatch: { brew: "hwatch", cargo: "hwatch" },
  macmon: { brew: "macmon", cargo: "macmon" },
  nethogs: { brew: "nethogs", apt: "nethogs", dnf: "nethogs", pacman: "nethogs" },
  trippy: { brew: "trippy", cargo: "trippy", scoop: "trippy" },
  wtf: { brew: "wtfutil", go: "github.com/wtfutil/wtf" },

  // ── Development (additions) ─────────────────────────────────────────────
  act3: { brew: "dhth/tap/act3", go: "github.com/dhth/act3" },
  atac: { brew: "atac", cargo: "atac" },
  codex: { npm: "@openai/codex" },
  dblab: { brew: "dblab", go: "github.com/danvergara/dblab" },
  delta: { brew: "git-delta", apt: "git-delta", cargo: "git-delta", scoop: "delta", winget: "dandavison.delta" },
  euporie: { pip: "euporie" },
  fx: { brew: "fx", go: "github.com/antonmedv/fx", scoop: "fx" },
  ghcup: { brew: "ghcup" },
  grv: { go: "github.com/rgburke/grv" },
  harlequin: { brew: "harlequin", pip: "harlequin" },
  jqp: { brew: "jqp", go: "github.com/noahgorstein/jqp", scoop: "jqp" },
  lazysql: { brew: "lazysql", go: "github.com/jorgerojas26/lazysql" },
  mitmproxy: { pip: "mitmproxy", apt: "mitmproxy", scoop: "mitmproxy", winget: "mitmproxy.mitmproxy", choco: "mitmproxy" },
  opencode: { brew: "opencode", npm: "opencode-ai" },
  posting: { brew: "posting", pip: "posting", scoop: "posting" },
  prs: { brew: "dhth/tap/prs", go: "github.com/dhth/prs" },
  pudb: { pip: "pudb", apt: "pudb" },
  rainfrog: { brew: "rainfrog", cargo: "rainfrog" },
  runme: { brew: "runme", go: "github.com/stateful/runme", scoop: "runme" },
  "sls-dev-tools": { npm: "sls-dev-tools" },
  "soft-serve": { brew: "soft-serve", go: "github.com/charmbracelet/soft-serve", scoop: "soft-serve" },
  termdbms: { go: "github.com/mathaou/termdbms" },

  // ── Docker / LXC / K8s (additions) ──────────────────────────────────────
  dive: { brew: "dive", go: "github.com/wagoodman/dive", scoop: "dive", winget: "wagoodman.dive" },
  dockly: { brew: "dockly", npm: "dockly" },
  dry: { brew: "dry", go: "github.com/moncho/dry", scoop: "dry" },
  e1s: { brew: "e1s", go: "github.com/keidarcy/e1s" },
  "eks-node-viewer": { go: "github.com/awslabs/eks-node-viewer/cmd/eks-node-viewer" },
  k9s: { brew: "k9s", go: "github.com/derailed/k9s", scoop: "k9s", winget: "derailed.k9s", choco: "k9s" },
  kdash: { brew: "kdash", cargo: "kdash" },
  kubetui: { cargo: "kubetui" },
  oxker: { brew: "oxker", cargo: "oxker" },
  "podman-tui": { brew: "podman-tui", go: "github.com/containers/podman-tui" },

  // ── Editors (additions) ─────────────────────────────────────────────────
  frogmouth: { pip: "frogmouth" },
  orbiton: { brew: "orbiton" },

  // ── File managers (additions) ───────────────────────────────────────────
  goful: { go: "github.com/anmitsu/goful" },
  mc: { brew: "midnight-commander", apt: "mc", dnf: "mc", pacman: "mc", scoop: "mc", winget: "GNU.MidnightCommander", choco: "mc" },

  // ── Games (additions) ───────────────────────────────────────────────────
  bastet: { brew: "bastet", apt: "bastet" },
  "moon-buggy": { brew: "moon-buggy", apt: "moon-buggy" },
  nethack: { brew: "nethack", apt: "nethack", pacman: "nethack" },
  nudoku: { brew: "nudoku", apt: "nudoku" },
  "tty-solitaire": { brew: "tty-solitaire", apt: "tty-solitaire" },

  // ── Libraries / TUI frameworks (additions) ─────────────────────────────
  bubbletea: { go: "github.com/charmbracelet/bubbletea" },
  gocui: { go: "github.com/jroimartin/gocui" },
  gum: { brew: "gum", go: "github.com/charmbracelet/gum", scoop: "gum" },
  ink: { npm: "ink" },
  ncurses: { brew: "ncurses", apt: "libncurses-dev" },
  notcurses: { brew: "notcurses" },
  "py_cui": { pip: "py-cui" },
  pterm: { go: "github.com/pterm/pterm" },
  "python prompt toolkit": { pip: "prompt-toolkit" },
  pytermgui: { pip: "pytermgui" },
  ratatui: { cargo: "ratatui" },
  rich: { pip: "rich" },
  tcell: { go: "github.com/gdamore/tcell/v2" },
  textual: { pip: "textual" },
  "tui-rs": { cargo: "tui" },
  tview: { go: "github.com/rivo/tview" },
  urwid: { pip: "urwid", apt: "python3-urwid" },

  // ── Messaging (additions) ───────────────────────────────────────────────
  alpine: { brew: "alpine", apt: "alpine", dnf: "alpine", pacman: "alpine" },
  discordo: { brew: "discordo", go: "github.com/ayntgl/discordo" },
  iamb: { brew: "iamb", cargo: "iamb" },
  mcabber: { brew: "mcabber", apt: "mcabber" },
  meli: { brew: "meli", cargo: "meli" },
  scli: { pip: "scli" },
  tut: { brew: "tut", go: "github.com/RasmusLindroth/tut" },
  "twitch-tui": { cargo: "twitch-tui" },
  "zulip-terminal": { pip: "zulip-term" },

  // ── Multimedia (additions) ──────────────────────────────────────────────
  castero: { pip: "castero" },
  chafa: { brew: "chafa", apt: "chafa", dnf: "chafa", pacman: "chafa" },
  kew: { brew: "kew" },
  managarr: { cargo: "managarr" },
  pyradio: { pip: "pyradio" },
  rmpc: { brew: "rmpc", cargo: "rmpc" },
  termusic: { brew: "termusic", cargo: "termusic" },
  timg: { brew: "timg", apt: "timg", dnf: "timg" },
  viu: { brew: "viu", cargo: "viu" },
  vlc: { apt: "vlc", pacman: "vlc", scoop: "vlc", winget: "VideoLAN.VLC", choco: "vlc" },

  // ── Productivity (additions) ────────────────────────────────────────────
  abook: { brew: "abook", apt: "abook" },
  dvtm: { apt: "dvtm" },
  elia: { pip: "elia-chat" },
  procmux: { go: "github.com/napisani/procmux" },
  television: { brew: "television", cargo: "television" },
  tenere: { brew: "tenere", cargo: "tenere" },
  termscp: { brew: "termscp", cargo: "termscp" },
  topydo: { pip: "topydo" },
  ttyplot: { brew: "ttyplot", apt: "ttyplot" },
  walker: { cargo: "walker" },
  zeit: { go: "github.com/mrusme/zeit" },

  // ── Web (additions) ─────────────────────────────────────────────────────
  "hackernews-tui": { cargo: "hackernews_tui" },
  "haxor-news": { pip: "haxor-news" },
  lagrange: { scoop: "lagrange", winget: "skyjake.Lagrange" },
  "textual-web": { pip: "textual-web" },

  // ── Miscellaneous (additions) ───────────────────────────────────────────
  cava: { brew: "cava", apt: "cava", dnf: "cava", pacman: "cava" },
  cfdisk: { brew: "util-linux", apt: "util-linux" },
  csvlens: { brew: "csvlens", cargo: "csvlens" },
  diskonaut: { brew: "diskonaut", cargo: "diskonaut" },
  "ec2-instance-selector": { go: "github.com/aws/amazon-ec2-instance-selector/v2/cli" },
  "gpg-tui": { brew: "gpg-tui", cargo: "gpg-tui" },
  jrnl: { brew: "jrnl", pip: "jrnl" },
  lnav: { brew: "lnav", apt: "lnav", dnf: "lnav", pacman: "lnav" },
  mapscii: { npm: "mapscii" },
  moc: { brew: "moc", apt: "moc" },
  mqttui: { brew: "mqttui", cargo: "mqttui" },
  nmtui: { apt: "network-manager", dnf: "NetworkManager" },
  oha: { brew: "oha", cargo: "oha" },
  pug: { brew: "pug", go: "github.com/leg100/pug" },
  termshark: { brew: "termshark", scoop: "termshark", winget: "gcla.termshark" },
  ttyper: { cargo: "ttyper" },
  wavemon: { apt: "wavemon", dnf: "wavemon" },
  wego: { brew: "wego", go: "github.com/schachmat/wego" },
};
