# Repo layout: package + site source

Type: grilling
Status: resolved

## Question

Where does the package source and the website source live on GitHub?

## Answer

**Monorepo at `https://github.com/musichen/justtuit`** (already exists; currently
holds the curated list at the root README).

- The package moves in as a subfolder (e.g. `app/` or `cli/`).
- The site lives in a `site/` folder and is deployed to GitHub Pages from there.
- The list stays as the root README (source of truth for the registry).

The local package repo (currently no `git remote`) will be pushed into this
monorepo as a folder.
