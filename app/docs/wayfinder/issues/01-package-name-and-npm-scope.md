# Package name and npm scope

Type: grilling
Status: resolved

## Question

What is the final package name and npm scope for the CLI?

## Answer

- **Primary package**: `justtuit` (unscoped, shortest memorable name).
- **Org alias**: also publish `@webboxes/justtuit` from the `webboxes` npm org, to
  promote web-boxes.com as the authors of the library.
- **Binary**: `justtuit`.
- **Install**: `npm i justtuit -g` (and `npx justtuit`).

The in-tree package is already named `justtuit` (package.json `name`, `bin/justtuit`).
Any legacy naming has been renamed to `justtuit`.
