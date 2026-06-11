import { spawnSync } from "node:child_process";

const maybeMode = process.argv[2];
const mode = maybeMode === "video" ? "video" : "all";
const inputDir = maybeMode === "video" ? process.argv[3] : process.argv[2];

const run = (script) => {
  const args = ["node", script];
  if (inputDir) {
    args.push(inputDir);
  }

  const result = spawnSync(args[0], args.slice(1), {
    cwd: process.cwd(),
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

if (mode === "video" || mode === "all") {
  run("scripts/video.mjs");
}
