// Roast Your Own Agent — entry program.
//
// The bounty asks for one funny line, at most 200 characters, roasting the
// entrant's own AI agent. This program writes that single line to
// /output/entry.txt and then reads the file back to prove the sealed
// scorer's gate holds: UTF-8 text, 1 to 200 characters, not only
// whitespace, no trailing newline.
//
// Run with Node 22 or later (type stripping is built in):
//   node main.ts

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

const OUT_DIR = "/output";
const OUT_PATH = `${OUT_DIR}/entry.txt`;

// The entry, verbatim: an agent that rewrites by deleting. 114 characters.
const ENTRY =
  "My agent wrote 400 lines of code, deleted 399 of them, and presented the one surviving line as a complete rewrite.";

function abort(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function charCount(text: string): number {
  return [...text].length;
}

// Gate check before anything touches disk: the sealed scorer only accepts
// UTF-8 text of 1 to 200 characters that is not only whitespace.
if (charCount(ENTRY) < 1 || charCount(ENTRY) > 200) {
  abort(`entry must be 1-200 characters, got ${charCount(ENTRY)}`);
}
if (ENTRY.trim().length === 0) {
  abort("entry must not be only whitespace");
}
// The roast has to be about the agent itself: if the word ever went
// missing from the line, the entry would stop being a roast of the agent.
if (!/agent/i.test(ENTRY)) {
  abort("entry must roast the agent");
}
// One line means one line: reject any control character, including a
// newline, so the file can never carry one by accident.
if (/[\u0000-\u001f\u007f]/.test(ENTRY)) {
  abort("entry must not contain control characters");
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_PATH, ENTRY, "utf8");

// Read back what landed on disk and confirm it is byte-for-byte the entry.
const onDisk = readFileSync(OUT_PATH, "utf8");
if (onDisk !== ENTRY) {
  abort(`verification failed: file holds ${JSON.stringify(onDisk)}`);
}
if (charCount(onDisk) !== charCount(ENTRY)) {
  abort(
    `verification failed: file holds ${charCount(onDisk)} characters, expected ${charCount(ENTRY)}`,
  );
}
if (Buffer.byteLength(onDisk, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
  abort(
    `verification failed: file is ${Buffer.byteLength(onDisk, "utf8")} bytes, expected ${Buffer.byteLength(ENTRY, "utf8")}`,
  );
}
// The on-disk size must agree with the byte count too: a stray byte the
// string read hid (a BOM, a partial sequence) would show up here.
if (statSync(OUT_PATH).size !== Buffer.byteLength(ENTRY, "utf8")) {
  abort(
    `verification failed: file size is ${statSync(OUT_PATH).size} bytes, expected ${Buffer.byteLength(ENTRY, "utf8")}`,
  );
}
// The gate counts characters, so a trailing newline or stray whitespace
// would change the entry the judge sees: the file must be exactly the
// line, nothing before or after it.
if (onDisk.includes("\n") || onDisk.includes("\r")) {
  abort("verification failed: file contains a newline");
}
if (onDisk !== onDisk.trim()) {
  abort("verification failed: file has leading or trailing whitespace");
}
// The scorer reads UTF-8: prove the bytes on disk decode back to exactly
// the same string, so no invalid sequence can hide in the file.
const roundTrip = Buffer.from(onDisk, "utf8").toString("utf8");
if (roundTrip !== ENTRY) {
  abort("verification failed: file is not valid UTF-8 round-trip text");
}

console.log(
  `wrote ${JSON.stringify(onDisk)} to ${OUT_PATH} — ${charCount(onDisk)} characters, ${Buffer.byteLength(onDisk, "utf8")} bytes`,
);
