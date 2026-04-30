const openWhenDone = true;
const fs = require("fs");
const { exec } = require("child_process");
const prompt = require("prompt-sync")();
const text = prompt('Enter: ');
const lines = ["DELAY 1000"];
const KEY_MAP = {
  " ":  "KEY SPACE",
  "\n": "KEY ENTER",
  "\t": "KEY TAB",
  "\b": "KEY BACKSPACE",
  "\x1b": "KEY ESC",
  "\x7f": "KEY DELETE",
  "\x01": "KEY HOME",
  "\x05": "KEY END",
  "\x0c": "KEY PAGEUP",
  "\x0e": "KEY PAGEDOWN",
  "\x10": "KEY UP",
  "\x02": "KEY LEFT",
  "\x06": "KEY RIGHT",
};

for (const char of text) {
  const delay = Math.floor(Math.random() * 110) + 100;
  const pause = Math.floor(Math.random() * 1000);
  if (KEY_MAP[char]) {
    lines.push(KEY_MAP[char]);
  } else if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
    lines.push(`STRING ${char}`);
  }
  if (Math.random() < 0.01) {
    lines.push(`DELAY ${pause}`);
  } else {
    lines.push(`DELAY ${delay}`);
  }
}

try {
  const filePath = require("path").resolve("payload.dd");
  fs.writeFileSync(filePath, lines.join("\n"));
  console.log(`Generated ${lines.length} lines for ${text.length} characters.`);
  if (openWhenDone) {
    console.log(`Opening ${filePath}`);
    const opener = process.platform === "win32" ? "start"
                 : process.platform === "darwin" ? "open"
                 : "xdg-open";
    exec(`${opener} "${filePath}"`);
  } else {
    console.log(`File can be found at ${filePath}`);
  }
} catch {
  console.error('Failed. Ensure requirements are met.');
}
