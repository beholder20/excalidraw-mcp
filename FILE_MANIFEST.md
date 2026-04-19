# Excalidraw MCP Server - Complete File Manifest

**Generated:** 2024-12-15  
**Project Path:** `/home/anudeep/Documents/AI_content/AntiGravity/skills/excalidraw-mcp-server`

---

## Directory Tree

```
excalidraw-mcp-server/
├── .git/                          # Full git repository history
├── .gitignore                     # Standard Node ignores
├── .mcpbignore                    # MCP binary build exclusions
├── .npmrc                         # npm/pnpm config
├── .vscode/                       # IDE settings (optional)
│
├── api/
│   └── mcp.ts                     # Vercel serverless handler [27 lines]
│
├── src/
│   ├── main.ts                    # CLI entry point [~70 lines]
│   ├── server.ts                  # MCP tool registration [~300 lines]
│   ├── checkpoint-store.ts        # State persistence layer [~200 lines]
│   ├── edit-context.ts            # Edit tracking helper [~50 lines]
│   ├── sounds.ts                  # Audio utilities [~20 lines]
│   ├── pencil-audio.ts            # Audio data embedded [~100 lines]
│   ├── mcp-app.tsx                # React widget core [~300 lines]
│   ├── mcp-entry.tsx              # Production React entry [~20 lines]
│   ├── dev.tsx                    # Development mock UI [~100 lines]
│   ├── dev-mock.ts                # Mock MCP server [~150 lines]
│   └── vite-env.d.ts              # Vite TypeScript defs [~3 lines]
│
├── docs/
│   ├── logo.png                   # MCP manifest icon
│   └── demo.gif                   # README animation
│
├── scripts/
│   ├── build.mjs                  # Build orchestration [41 lines]
│   └── setup-bun.mjs              # Optional Bun installer [~30 lines]
│
├── index-dev.html                 # Dev server entry point
├── package.json                   # Dependencies & scripts [71 lines]
├── pnpm-lock.yaml                 # Locked dependency tree (~1MB)
├── tsconfig.json                  # TypeScript config [20 lines]
├── tsconfig.server.json           # Server TypeScript config [varies]
├── vite.config.ts                 # Vite build config [39 lines]
├── vite.config.dev.ts             # Dev server Vite config [~20 lines]
├── vercel.json                    # Vercel deployment config [23 lines]
├── manifest.json                  # MCP manifest v0.3 [44 lines]
├── CLAUDE.md                      # Architecture guide [205 lines] ⭐⭐⭐
├── README.md                      # Installation & usage
├── MIGRATION_EXPLORATION_REPORT.md # Detailed analysis [501 lines] ⭐⭐⭐
├── QUICK_REFERENCE.txt            # Quick summary [~180 lines] ⭐⭐
└── FILE_MANIFEST.md               # This file
```

---

## Detailed File Analysis

### Core Entry Points

#### `src/main.ts` (70 lines)
**Purpose:** CLI entry point for standalone MCP server  
**Key Functions:**
- `startStreamableHTTPServer()` — HTTP transport (Streamable, stateless)
- `startStdioServer()` — stdio transport (Claude Desktop)
- Port selection from env (default 3001)
- CORS middleware setup
- Express app initialization

**Dependencies:**
- `@modelcontextprotocol/sdk/server/express`
- `@modelcontextprotocol/sdk/server/stdio`
- `express`, `cors`

**Entry Point Conditions:**
- `--stdio` flag → stdio transport
- Default → HTTP on port 3001

**Usage:**
```bash
node dist/index.js              # HTTP mode (port 3001)
node dist/index.js --stdio      # Claude Desktop mode
```

---

#### `src/server.ts` (300+ lines)
**Purpose:** MCP tool registration & core logic  
**Key Exports:**
- `registerTools(server, distDir, store)` — Register all tools
- `createServer()` — Factory function for new server instance
- Tool implementations: `read_me`, `create_view`
- Resource implementation: Excalidraw widget HTML

**Tool 1: read_me**
- No parameters
- Returns: Cheat sheet with element format, color palette, examples
- Use: Model should call once per conversation

**Tool 2: create_view**
- Parameter: `elements` (JSON string)
- Processes partial JSON during streaming
- Renders SVG → morphdom diffing
- Returns: `checkpointId` for restoration
- Side effect: Sends PNG screenshot to Claude context

**Key Functions:**
- `parsePartialElements()` — Streaming JSON parser
- `exportToSvg()` — Excalidraw export (wrapped)
- `createCheckpointId()` — 18-char UUID generator
- Validation: Zod schemas for all inputs

**State:**
- Uses `CheckpointStore` interface (abstracted)
- Reads `distDir/mcp-app.html` for widget

---

#### `src/checkpoint-store.ts` (200+ lines)
**Purpose:** State persistence layer with multiple backends  
**Architecture:**
```typescript
interface CheckpointStore {
  get(key: string): Promise<CheckpointData>
  set(key: string, data: CheckpointData): Promise<void>
  delete(key: string): Promise<void>
}
```

**Implementations:**

1. **FileCheckpointStore** (dev)
   - Path: `$TMPDIR/excalidraw-mcp-checkpoints/`
   - Format: JSON files (`{checkpointId}.json`)
   - TTL: Unlimited
   - Use: Local development

2. **MemoryCheckpointStore** (fallback)
   - Storage: In-memory Map
   - TTL: Unlimited
   - Use: Vercel default (lost on cold start)
   - Note: 512 entry limit

3. **RedisCheckpointStore** (production)
   - Backend: Upstash Redis (Vercel KV)
   - TTL: 30 days
   - Use: Vercel with Redis enabled
   - Auth: UPSTASH_REDIS_REST_* env vars

**Factory:**
```typescript
createVercelStore() → RedisCheckpointStore | MemoryCheckpointStore
createFileStore()   → FileCheckpointStore
```

**Data Format:**
```json
{
  "elements": [/* Excalidraw elements */],
  "camera": { "x": 0, "y": 0, "zoom": 1 },
  "containerId": "optional-filter"
}
```

---

#### `src/mcp-app.tsx` (300+ lines)
**Purpose:** React widget for rendering Excalidraw diagrams  
**Component Hierarchy:**
```
ExcalidrawApp (useApp hook)
  └── ExcalidrawAppCore (SVG rendering + diffing)
      ├── StreamingPreview (morphdom update)
      └── Fullscreen mode (safe-area insets)
```

**Key Props:**
- `distDir` — Path to widget assets
- `store` — CheckpointStore instance

**Features:**
1. **Streaming Rendering**
   - Partial JSON parsing (during tool streaming)
   - morphdom diffing (smooth updates)
   - CSS animations (draw-on effect for lines)

2. **Fullscreen Mode**
   - `app.requestDisplayMode({ mode: "fullscreen" })`
   - Safe-area insets (mobile)
   - Escape key to exit
   - Button in top-right (hidden in fullscreen)

3. **Screenshot Export**
   - SVG → PNG (512px max)
   - Sent to model context via `app.updateModelContext()`
   - Debounced (1.5s delay)

4. **Checkpoint Management**
   - `read_checkpoint` — Retrieve saved diagram
   - `save_checkpoint` — Debounced user edits
   - `restore_checkpoint` — Load previous version

**CSS Animations:**
- Shapes: opacity fade-in 0.5s
- Lines: stroke-dashoffset draw-on 0.6s
- Existing elements: smooth transitions

---

### Configuration Files

#### `package.json` (71 lines)
**Key Sections:**

**Name & Version:**
```json
{
  "name": "@mcp-demos/excalidraw-server",
  "version": "0.3.2",
  "type": "module",
  "packageManager": "pnpm@10.11.0"
}
```

**Bin Entry:**
```json
{
  "bin": {
    "mcp-server-excalidraw": "dist/index.js"
  }
}
```

**Scripts (8 total):**
| Script | Command | Purpose |
|--------|---------|---------|
| `build` | `node scripts/build.mjs` | Full pipeline build |
| `watch` | `vite build --watch` | Continuous rebuild |
| `serve` | `bun --watch src/main.ts` | MCP server (hot-reload) |
| `start` | Build + serve | Dev mode |
| `dev` | watch + serve (parallel) | Full dev mode |
| `dev:ui` | `vite --config vite.config.dev.ts` | UI-only dev |
| `postinstall` | Optional Bun setup | Auto-run on npm install |
| `prepublishOnly` | `npm run build` | Pre-publish hook |

**Dependencies (24 direct):**
- MCP: `@modelcontextprotocol/sdk@1.25.2`, `@modelcontextprotocol/ext-apps@^0.4.0`
- Rendering: `@excalidraw/excalidraw@^0.18.0`, `morphdom@^2.7.8`
- Runtime: `express@^5.1.0`, `react@^19.0.0`, `react-dom@^19.0.0`
- Utils: `zod@^4.0.0`, `cors@^2.8.5`, `mcp-handler@1.0.7`
- Optional: `@upstash/redis@^1.34.0` (Vercel)

**Dev Dependencies (8 total):**
- Bundling: `vite@^6.0.0`, `vite-plugin-singlefile@^2.3.0`
- TypeScript: `typescript@^5.9.3`, `@types/*`
- Build: `concurrently@^9.2.1`, `cross-env@^10.1.0`
- Optional: Bun platform binaries

---

#### `manifest.json` (44 lines)
**MCP Manifest v0.3 Specification**

```json
{
  "manifest_version": "0.3",
  "name": "excalidraw-mcp-app",
  "display_name": "Excalidraw",
  "version": "0.3.2",
  "description": "Hand-drawn diagrams with streaming...",
  "author": {
    "name": "Anton Pidkuiko",
    "url": "https://github.com/antonpk1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/antonpk1/excalidraw-mcp-app.git"
  },
  "server": {
    "type": "node",
    "entry_point": "dist/index.js",
    "mcp_config": {
      "command": "node",
      "args": ["${__dirname}/dist/index.js", "--stdio"]
    }
  },
  "tools": [
    { "name": "read_me", "description": "Reference cheat sheet" },
    { "name": "create_view", "description": "Render diagram" }
  ],
  "compatibility": {
    "platforms": ["darwin", "win32", "linux"],
    "runtimes": { "node": ">=18.0.0" }
  }
}
```

**Key Points:**
- Entry point: `dist/index.js` (compiled by Bun)
- Transport: stdio by default (can also use HTTP via main.ts)
- Tools: read_me (reference), create_view (rendering)
- Platform support: All major platforms
- Runtime: Node.js ≥18.0.0

---

#### `vite.config.ts` (39 lines)
**Widget Build Configuration**

**External Modules (loaded from CDN):**
```typescript
external: [
  "react",
  "react-dom",
  "react-dom/client",
  "react/jsx-runtime",
  "@excalidraw/excalidraw",
  "morphdom"
]
```

**CDN Path Mapping (esm.sh):**
```typescript
paths: {
  "react": "https://esm.sh/react@19.0.0",
  "react-dom": "https://esm.sh/react-dom@19.0.0?deps=react@19.0.0",
  "@excalidraw/excalidraw": "https://esm.sh/@excalidraw/excalidraw@0.18.0?deps=react@19.0.0,react-dom@19.0.0",
  "morphdom": "https://esm.sh/morphdom@2.7.8"
}
```

**Build Options:**
```typescript
{
  input: "src/mcp-app.html",     // Single entry point
  outDir: "dist",                // Output directory
  emptyOutDir: false,            // Don't clear dist/
  cssMinify: !isDevelopment,     // Minify in prod
  minify: !isDevelopment,        // Minify in prod
  sourcemap: isDevelopment ? "inline" : undefined
}
```

**Output:** Single HTML file with inlined CSS/JS (~200-300KB)

**CSP:** Allows esm.sh domain (for Virgil font)

---

#### `vercel.json` (23 lines)
**Vercel Deployment Configuration**

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": ".",
  "cleanUrls": false,
  "redirects": [
    { "source": "/", "destination": "/mcp", "statusCode": 308 }
  ],
  "rewrites": [
    { "source": "/mcp", "destination": "/api/mcp" },
    { "source": "/sse", "destination": "/api/mcp" },
    { "source": "/message", "destination": "/api/mcp" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Accept, Authorization, Mcp-Session-Id" }
      ]
    }
  ]
}
```

**Key Routes:**
- `/` → redirect to `/mcp` (308)
- `/mcp`, `/sse`, `/message` → `api/mcp.ts` handler
- CORS headers: Allow all origins + methods

---

#### `tsconfig.json` (20 lines)
**TypeScript Configuration**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src", "server.ts"]
}
```

**Key Settings:**
- Strict mode: ALL strictness flags enabled
- Target: ESNext (preserves modern syntax)
- Module: ESNext + bundler resolution
- Warnings: No unused locals/parameters
- JSX: react-jsx (automatic)

---

### Build & Scripts

#### `scripts/build.mjs` (41 lines)
**Build Orchestration Pipeline**

```javascript
// 1. Clean dist/
rmSync(join(root, "dist"), { recursive: true, force: true });

// 2. Type-check (no emit)
run("tsc --noEmit");

// 3. Vite build (singlefile HTML)
run("vite build");

// 4. Move HTML output to dist root
renameSync(/* mcp-app.html */, /* dist/mcp-app.html */);
rmSync(join(root, "dist", "src"), { recursive: true, force: true });

// 5. Build server types
run("tsc -p tsconfig.server.json");

// 6. Bundle server + index with Bun
run('bun build "src/server.ts" --outdir dist --target node');
run('bun build "src/main.ts" --outfile "dist/index.js" --target node --banner "#!/usr/bin/env node"');
```

**Pipeline Stages:**
1. **Clean** — Remove old dist/
2. **Type-check** — Verify TypeScript correctness
3. **Vite** — Build single-file HTML widget
4. **Organize** — Move outputs to correct locations
5. **Types** — Generate .d.ts for server
6. **Bundle** — Use Bun to bundle Node.js scripts

**Outputs:**
- `dist/index.js` — CLI entry (with shebang)
- `dist/server.js` — Library export
- `dist/server.d.ts` — Type definitions
- `dist/mcp-app.html` — Widget HTML

**Tool:** Bun (can fallback to esbuild)

---

### Documentation

#### `CLAUDE.md` (205 lines) ⭐⭐⭐
**Comprehensive Architecture Guide**

**Sections:**
1. Architecture overview (layers & components)
2. Tools documentation (read_me, create_view)
3. Key design decisions (WHY, not just WHAT)
4. Checkpoint system details
5. Build process explanation
6. Running instructions (HTTP, stdio, dev modes)
7. Claude Desktop configuration
8. Rendering pipeline (streaming + final)
9. CSS animation details
10. Progressive element ordering
11. Debugging guide with log paths
12. Common issues & gotchas

**Key Insights:**
- Why standard Excalidraw JSON (not custom format)
- Why SVG-only rendering (no React canvas)
- Why morphdom for diffing (smooth streaming)
- Why checkpoint system needed
- Mobile fullscreen safe-area insets
- Font loading from esm.sh
- Logger usage (never console.log in widget)

**Must-Read Before:**
- Making changes to rendering logic
- Debugging fullscreen mode
- Modifying checkpoint system
- Changing build configuration

---

#### `README.md`
**Installation & Usage Guide**

**Sections:**
- Quick install (download .mcpb or build from source)
- Usage examples (Claude prompts)
- MCP Apps explanation
- Contributing guidelines
- Deploy-to-Vercel button
- Release checklist (for maintainers)

---

### Development Files

#### `src/dev.tsx` (100+ lines)
**Development Mock UI**

**Purpose:** Standalone testing without MCP server  
**Components:**
- Mock app wrapper
- Sample diagram elements
- Control panel (event simulation)
- Live preview with streaming simulation

**Usage:**
```bash
npm run dev:ui
# Opens http://localhost:5173/index-dev.html
```

---

#### `src/dev-mock.ts` (150+ lines)
**Mock MCP Server**

**Purpose:** Simulate MCP events for UI testing  
**Functions:**
- `sendToolInput()` — Simulate tool completion
- `streamElements()` — Stream partial JSON
- `updateModelContext()` — Send screenshot
- Event simulation for checkpoint operations

---

#### `index-dev.html`
**Dev Server Entry Point**

Used by `npm run dev:ui` to serve mock UI  
Vite dev server runs on http://localhost:5173

---

### Helper Files

#### `src/checkpoint-store.ts` (200+ lines)
**Already analyzed above** — State persistence layer

---

#### `src/edit-context.ts` (50+ lines)
**Edit Tracking Helper**

**Purpose:** Track user edits during fullscreen mode  
**Functions:**
- `captureEditContext()` — Record edit state
- `detectChanges()` — Diff elements
- `boundTextFiltering()` — Filter container-bound text

---

#### `src/sounds.ts` (20 lines)
**Audio Utilities**

**Purpose:** Handle drawing sounds  
**Functions:**
- `playDrawSound()` — Audio feedback during drawing

---

#### `src/pencil-audio.ts` (100+ lines)
**Audio Data**

**Purpose:** Embedded audio asset  
**Content:** Base64-encoded pencil drawing sound  
**Usage:** Decoded and played in widget

---

#### `api/mcp.ts` (27 lines) ⚠️
**Vercel Serverless Handler**

```typescript
import { createMcpHandler } from "mcp-handler";
import path from "node:path";
import { createVercelStore } from "../src/checkpoint-store.js";  // ⚠️ RELATIVE
import { registerTools } from "../src/server.js";              // ⚠️ RELATIVE

// Create MCP handler
const mcpHandler = createMcpHandler((server) => {
  const distDir = path.join(process.cwd(), "dist");
  registerTools(server, distDir, store);
}, {...});

// Route requests
export { handler as GET, handler as POST, handler as DELETE };
```

**Migration Alert:**
- Hard-coded `../src/` imports
- Requires path updates if moving to monorepo
- Handler wraps MCP for stateless execution

---

### Configuration Helpers

#### `.gitignore`
```
node_modules/
dist/
.DS_Store
*.mcpb
.vercel
bun.lock
.vscode
opencode.json
```

---

#### `.mcpbignore`
**MCP Binary Build Exclusions**

```
node_modules/
src/
*.ts
!*.d.ts
/mcp-app.html
tsconfig.json
tsconfig.server.json
vite.config.ts
CLAUDE.md
.git/
.gitignore
*.mcpb
```

**Includes in binary:**
- `dist/`
- `manifest.json`
- `package.json`
- `pnpm-lock.yaml`
- `docs/`

---

#### `.npmrc`
```
node-linker=hoisted
```
**pnpm configuration:** Use hoisted node_modules layout

---

#### `vite.config.dev.ts`
**Development Vite Configuration**

- Resolves modules from node_modules (not CDN)
- Inline sourcemaps (dev only)
- Dev server on localhost:5173

---

#### `tsconfig.server.json`
**Server TypeScript Configuration**

- Compiles only backend files
- Target: ESNext for Node.js
- Used for type emission only (not code generation)

---

## File Dependencies & Relationships

```
Main Entry (dist/index.js)
  ↓
src/main.ts
  ├── import: @modelcontextprotocol/sdk/server/*
  ├── import: express
  ├── import: ./checkpoint-store.js
  └── import: ./server.js
      ↓
      src/server.ts
        ├── import: @modelcontextprotocol/ext-apps
        ├── import: @excalidraw/excalidraw
        ├── import: zod
        ├── import: ./checkpoint-store.js
        └── reads: dist/mcp-app.html (widget)
            ↓
            src/mcp-app.tsx
              ├── import: react, react-dom
              ├── import: morphdom
              ├── import: @excalidraw/excalidraw
              └── uses: CDN imports (esm.sh)

Vercel Entry (api/mcp.ts)
  ├── import: ../src/checkpoint-store.js    ⚠️ RELATIVE
  ├── import: ../src/server.js              ⚠️ RELATIVE
  └── imports: mcp-handler

Build Pipeline
  ├── scripts/build.mjs
  │   ├── runs: tsc --noEmit
  │   ├── runs: vite build (→ dist/mcp-app.html)
  │   ├── runs: tsc -p tsconfig.server.json (→ dist/*.d.ts)
  │   ├── runs: bun build src/server.ts (→ dist/server.js)
  │   └── runs: bun build src/main.ts (→ dist/index.js)
  │
  └── Output Files
      ├── dist/index.js
      ├── dist/server.js
      ├── dist/server.d.ts
      └── dist/mcp-app.html
```

---

## File Statistics Summary

| Category | File | Lines | Purpose |
|----------|------|-------|---------|
| **Entry** | `src/main.ts` | ~70 | CLI server entry |
| **Core Logic** | `src/server.ts` | ~300 | Tool registration |
| **State** | `src/checkpoint-store.ts` | ~200 | Persistence layer |
| **Widget** | `src/mcp-app.tsx` | ~300 | React rendering |
| **Config** | `package.json` | 71 | Dependencies |
| **Config** | `manifest.json` | 44 | MCP metadata |
| **Config** | `vite.config.ts` | 39 | Build config |
| **Config** | `tsconfig.json` | 20 | TypeScript config |
| **Config** | `vercel.json` | 23 | Deployment config |
| **Build** | `scripts/build.mjs` | 41 | Build orchestration |
| **Docs** | `CLAUDE.md` | 205 | Architecture guide |
| **Vercel** | `api/mcp.ts` | 27 | Serverless handler |
| **Dev** | `src/dev.tsx` | ~100 | Dev mock UI |
| **Dev** | `src/dev-mock.ts` | ~150 | Mock MCP server |
| **Dev** | `index-dev.html` | - | Dev entry |
| **Helper** | `src/edit-context.ts` | ~50 | Edit tracking |
| **Helper** | `src/sounds.ts` | ~20 | Audio utilities |
| **Helper** | `src/pencil-audio.ts` | ~100 | Audio asset |
| **Helper** | `src/vite-env.d.ts` | ~3 | Vite types |

**Total:** ~2,500 lines of TypeScript/TSX (excluding config & setup)

---

## Critical Files for Migration

1. **READ FIRST:** `CLAUDE.md` (design decisions + architecture)
2. **UNDERSTAND:** `src/server.ts` (tool logic)
3. **UPDATE:** `api/mcp.ts` (relative paths)
4. **VERIFY:** `scripts/build.mjs` (build compatibility)
5. **CONFIGURE:** `vite.config.ts` (CDN dependencies)
6. **TEST:** `package.json` (dependency versions)

---

## Files by Criticality for Monorepo Migration

| File | Impact | Action |
|------|--------|--------|
| `api/mcp.ts` | 🔴 HIGH | Update relative paths |
| `scripts/build.mjs` | 🟡 MEDIUM | Verify Bun/esbuild compatibility |
| `vite.config.ts` | 🟡 MEDIUM | Check esm.sh accessibility |
| `vercel.json` | 🟡 MEDIUM | Update deploy routing |
| `package.json` | 🟢 LOW | Bump version only |
| `manifest.json` | 🟢 LOW | No changes needed |
| `src/*.ts` | 🟢 LOW | Internal imports safe |
| `CLAUDE.md` | 🟢 LOW | Preserve for reference |

---

**Generated:** 2024-12-15  
**Status:** Complete file manifest and analysis ready for migration planning
