const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const prompt = require("prompt-sync")();

const KEY_MAP = {
  " ":    "SPACE",
  "\n":   "ENTER",
  "\t":   "TAB",
  "\b":   "BACKSPACE",
  "\x1b": "ESC",
  "\x7f": "DELETE",
  "\x01": "HOME",
  "\x05": "END",
  "\x0c": "PAGE_UP",
  "\x0e": "PAGE_DOWN",
  "\x10": "UP_ARROW",
  "\x02": "LEFT_ARROW",
  "\x06": "RIGHT_ARROW",
};

const text = prompt("Enter text: ");

if (!text || text.length === 0) {
  console.error("Error: No input provided.");
  process.exit(1);
}

const lines = ["DELAY 1000"];
let skipped = 0;

for (const char of text) {
  if (KEY_MAP[char]) {
    lines.push(KEY_MAP[char]);
  } else if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
    lines.push(`STRING ${char}`);
  } else {
    skipped++;
    continue;
  }

  const delay = Math.random() < 0.01
    ? Math.floor(Math.random() * 1500)
    : Math.floor(Math.random() * 110) + 100;
  lines.push(`DELAY ${delay}`);
}

if (skipped > 0) {
  console.warn(`Warning: ${skipped} character(s) were skipped (non-ASCII or unsupported).`);
}

try {
  const filePath = path.resolve("payload.dd");
  fs.writeFileSync(filePath, lines.join("\n"));
  console.log(`Generated ${lines.length} lines for ${text.length} characters → ${filePath}`);
} catch (err) {
  console.error("Failed to write output file:", err.message);
  process.exit(1);
}
