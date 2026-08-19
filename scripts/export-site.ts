/**
 * Export the registry to a JSON file for the static site (site/).
 *
 * Run with:  bun scripts/export-site.ts
 * Output:    site/data/tools.json
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { categories, tools } from "../src/registry/tools.js";
import { installCommands } from "../src/install.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "site", "data");

const data = {
  generatedAt: new Date().toISOString(),
  categories: categories.map((c) => ({
    id: c.id,
    name: c.name,
    count: tools.filter((t) => t.category === c.id).length,
  })),
  tools: tools.map((t) => {
    const seen = new Set<string>();
    const install: Array<{ manager: string; command: string }> = [];
    for (const c of installCommands(t)) {
      if (seen.has(c.command)) continue;
      seen.add(c.command);
      install.push({ manager: c.manager, command: c.command });
    }
    return {
      id: t.id,
      name: t.name,
      url: t.url,
      description: t.description,
      category: t.category,
      subcategory: t.subcategory,
      install,
    };
  }),
};

mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, "tools.json"), JSON.stringify(data));
console.log(`✓ wrote ${data.tools.length} tools / ${data.categories.length} categories to site/data/tools.json`);
