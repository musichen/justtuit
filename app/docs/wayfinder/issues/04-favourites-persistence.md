# Favourites persistence

Type: grilling
Status: resolved

## Question

Where and how are favourites persisted?

## Answer

A single lightweight JSON file: **`~/.justtuit/favourites.json`** (the directory
is created on first write). No sqlite or extra dependency - a plain JSON array of
tool ids is the simplest robust option.

- Read once at startup (tolerate a missing/corrupt file by starting empty).
- Write atomically on change (temp file + rename).
- No migrations in the MVP.
