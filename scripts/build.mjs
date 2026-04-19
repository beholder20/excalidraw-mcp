#!/usr/bin/env node
import { execSync } from "child_process";
import { renameSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function run(cmd, env = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

rmSync(join(root, "runtime/dist"), { recursive: true, force: true });

// 1. Type-check
run("tsc --noEmit");

// 2. Vite build (singlefile HTML)
run("vite build");

// 3. Move the HTML output to runtime/dist root (cross-platform)
renameSync(
  join(root, "runtime/dist", "src", "mcp-app.html"),
  join(root, "runtime/dist", "mcp-app.html"),
);
rmSync(join(root, "runtime/dist", "src"), { recursive: true, force: true });

// 4. Build server types
run("tsc -p tsconfig.server.json");

// 5. Bundle server + index
run('bun build "src/server.ts" --outdir runtime/dist --target node');
run(
  'bun build "src/main.ts" --outfile "runtime/dist/index.js" --target node --banner "#!/usr/bin/env node"',
);
