import fs from "fs";
import path from "path";

const REQUIRED_FIELDS = [
  "id",
  "title",
  "type",
  "status",
  "version",
  "published_at",
  "authors",
  "summary",
  "pdf"
];

function validateMeta(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const meta = JSON.parse(raw);

  const missing = REQUIRED_FIELDS.filter(f => !(f in meta));

  if (missing.length > 0) {
    throw new Error(
      `❌ ${filePath} missing fields: ${missing.join(", ")}`
    );
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full);
    if (entry === "meta.json") validateMeta(full);
  }
}

walk("publications");
console.log("✔ All metadata valid");
