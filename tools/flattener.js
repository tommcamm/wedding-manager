import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Replace this with your real input file path
const inputFile = "../messages/it.json";
const outputFile = "../messages/it-new.json";

// Helper to flatten nested objects
function flatten(obj, prefix = "", res = {}) {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      flatten(value, newKey, res);
    } else {
      res[newKey] = { value }; // wrap with { value: "..." }
    }
  }
  return res;
}

// Read + transform
const input = JSON.parse(readFileSync(resolve(inputFile), "utf8"));
const output = flatten(input);

// Write result
writeFileSync(
  resolve(outputFile),
  JSON.stringify(output, null, 2),
  "utf8"
);

console.log(`✅ Done! Flat JSON written to ${outputFile}`);
