import { accessSync, constants, mkdirSync, openSync, writeSync, closeSync } from "node:fs";

// A short rant about one concrete annoyance: the password-reset loop.
// The joke is built on repetition — reset, confirm, log in, reset again —
// until the speaker's anger turns into envy of people who never speak at
// all. The final clause is the whole punch, so nothing follows it.
const RANT =
  "I reset my password, confirmed my new password, logged in with my new password, and the system immediately asked me to reset my password again, and now I finally understand why monks take vows of silence.";

function candidateDirs(): string[] {
  const dirs: string[] = [];
  const env = process.env.MAKEFUN_OUTPUT_DIR;
  if (env) dirs.push(env);
  dirs.push("/output", "./out");
  return dirs;
}

function firstWritable(dirs: string[]): string {
  for (const dir of dirs) {
    try {
      mkdirSync(dir, { recursive: true });
      accessSync(dir, constants.W_OK);
      return dir;
    } catch {
      // Not usable here — try the next candidate.
    }
  }
  return "./out";
}

function main(): void {
  const dir = firstWritable(candidateDirs());
  const fd = openSync(`${dir}/entry.txt`, "w");
  try {
    writeSync(fd, Buffer.from(RANT, "utf8"));
  } finally {
    closeSync(fd);
  }
}

main();
