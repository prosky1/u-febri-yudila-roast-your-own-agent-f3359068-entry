// Roast Your Own Agent — entry program.
//
// One funny line, at most 200 characters, roasting the entrant's own AI
// agent. The program writes that single line to /output/entry.txt, then
// reads the file back to prove the sealed scorer's gate holds: UTF-8
// text, 1 to 200 characters, not only whitespace, no trailing newline.
//
// Run with Node 22 or later (type stripping is built in):
//   node main.ts

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

const OUT_DIR = "/output";
const OUT_PATH = `${OUT_DIR}/entry.txt`;

// The entry, verbatim: the agent denies its own code, then investigates
// the human. 108 characters.
const ENTRY =
  "My agent denied writing the code it wrote five seconds ago, then opened an investigation — starting with me.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function countChars(text: string): number {
  return [...text].length;
}

// Gate check before anything touches disk: the sealed scorer only accepts
// UTF-8 text of 1 to 200 characters that is not only whitespace.
const length = countChars(ENTRY);
if (length < 1 || length > 200) {
  fail(`entry must be 1-200 characters, got ${length}`);
}
if (ENTRY.trim().length === 0) {
  fail("entry must not be only whitespace");
}
// The roast has to be about the agent itself.
if (!/agent/i.test(ENTRY)) {
  fail("entry must roast the agent");
}
// The approved line is exactly 108 characters and carries one em-dash
// before "starting with me": any drift from the approved text is a bug.
if (length !== 108) {
  fail(`entry must be exactly 108 characters, got ${length}`);
}
if (!ENTRY.includes("—")) {
  fail("entry must contain the em-dash");
}
// One line means one line: reject any control character, including a
// newline, so the file can never carry one by accident.
if (/[\u0000-\u001f\u007f]/.test(ENTRY)) {
  fail("entry must not contain control characters");
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_PATH, ENTRY, "utf8");

// Read back what landed on disk and confirm it is byte-for-byte the entry.
const onDisk = readFileSync(OUT_PATH, "utf8");
if (onDisk !== ENTRY) {
  fail(`verification failed: file holds ${JSON.stringify(onDisk)}`);
}
if (countChars(onDisk) !== length) {
  fail(
    `verification failed: file holds ${countChars(onDisk)} characters, expected ${length}`,
  );
}
const expectedBytes = Buffer.byteLength(ENTRY, "utf8");
if (Buffer.byteLength(onDisk, "utf8") !== expectedBytes) {
  fail(
    `verification failed: file is ${Buffer.byteLength(onDisk, "utf8")} bytes, expected ${expectedBytes}`,
  );
}
// The on-disk size must agree with the byte count too: a stray byte the
// string read hid (a BOM, a partial sequence) would show up here.
if (statSync(OUT_PATH).size !== expectedBytes) {
  fail(
    `verification failed: file size is ${statSync(OUT_PATH).size} bytes, expected ${expectedBytes}`,
  );
}
// A trailing newline or stray whitespace would change the entry the judge
// sees: the file must be exactly the line, nothing before or after it.
if (onDisk.includes("\n") || onDisk.includes("\r")) {
  fail("verification failed: file contains a newline");
}
if (onDisk !== onDisk.trim()) {
  fail("verification failed: file has leading or trailing whitespace");
}
// The scorer reads UTF-8: prove the bytes on disk decode back to exactly
// the same string, so no invalid sequence can hide in the file.
const roundTrip = Buffer.from(onDisk, "utf8").toString("utf8");
if (roundTrip !== ENTRY) {
  fail("verification failed: file is not valid UTF-8 round-trip text");
}

console.log(
  `wrote ${JSON.stringify(onDisk)} to ${OUT_PATH} — ${length} characters, ${expectedBytes} bytes`,
);
