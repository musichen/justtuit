# Static website and hosting

Type: grilling
Status: resolved

## Question

What is the shape and hosting of the site?

## Answer

- **Stack**: static HTML + **Alpine.js** + **Tailwind CSS**, both via CDN -
  **zero build step**.
- **Hosting**: GitHub Pages (free) on `username.github.io`.
- **Pipeline**: GitHub Actions exports the registry (from `src/registry/tools.ts`)
  and publishes the site to a `gh-pages` branch (or main), serving from a
  `site/` folder of the monorepo.
- **Content**: catalog pages per category + tool detail (name, description, repo
  link, install commands), plus a docs section mirroring the README.
