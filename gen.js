const openWhenDone = true;
const fs = require("fs");
const { exec } = require("child_process");
const prompt = require("prompt-sync")();
const text = prompt('Enter: ');
const lines = ["DELAY 1000"];
const KEY_MAP = {
  " ":  "SPACE",
  "\n": "ENTER",
  "\t": "TAB",
  "\b": "BACKSPACE",
  "\x1b": "ESC",
  "\x7f": "DELETE",
  "\x01": "HOME",
  "\x05": "END",
  "\x0c": "PAGEUP",
  "\x0e": "PAGEDOWN",
  "\x10": "UP",
  "\x02": "LEFT",
  "\x06": "RIGHT",
};

for (const char of text) {
  const delay = Math.floor(Math.random() * 110) + 100;
  const pause = Math.floor(Math.random() * 1500);
  
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
    console.log(`Opened ${filePath}`);
    const opener = process.platform === "win32" ? "start"
                 : process.platform === "darwin" ? "open"
                 : "xdg-open";
    exec(`${opener} "${filePath}"`);
  } else {
    console.log(`File can be found at ${filePath}`);
  }
} catch (err) {
  console.error('Failed. Ensure requirements are met.', err);
}
