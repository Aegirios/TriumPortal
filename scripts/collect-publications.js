import fs from "fs";
import path from "path";

const PUB_DIR = "publications";
const OUTPUT_DATA = "site/src/data/publications.json";
const OUTPUT_PDF = "site/public/pdf";

const publications = [];

function walk(dir, type = null) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);

    if (fs.statSync(full).isDirectory()) {
      walk(full, type ?? entry);
    }

    if (entry === "meta.json") {
      const meta = JSON.parse(fs.readFileSync(full, "utf-8"));
      meta.type = type;

      const pdfSource = path.join(path.dirname(full), meta.pdf);
      const pdfTarget = path.join(OUTPUT_PDF, meta.pdf);

      fs.copyFileSync(pdfSource, pdfTarget);

      meta.pdf = `/pdf/${meta.pdf}`;
      publications.push(meta);
    }
  }
}

fs.mkdirSync(OUTPUT_PDF, { recursive: true });

walk(PUB_DIR);

fs.writeFileSync(
  OUTPUT_DATA,
  JSON.stringify(publications, null, 2)
);

console.log(`✔ ${publications.length} publications collected`);
