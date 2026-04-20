# Excalidraw MCP Server

Standalone MCP server that streams Excalidraw diagrams as SVG with hand-drawn animations.

**Version:** 1.2.2  
**Repository:** https://github.com/beholder20/excalidraw-mcp

![Demo](docs/demo.gif)

---

## Features

- Streams Excalidraw diagrams as SVG with hand-drawn animations
- Two MCP tools: `read_me` (cheat sheet) and `create_view` (diagram creation)
- Checkpoint system for diagram state persistence
- Supports both HTTP (Streamable) and stdio transports
- Auto-sizing, fullscreen mode, and progressive element ordering
- SVG-only rendering with morphdom for efficient updates
- **OpenCode IDE compatible** — works with terminal, desktop, and IDE extensions

---

## Installation

```bash
# Clone the repository
git clone https://github.com/beholder20/excalidraw-mcp.git
cd excalidraw-mcp

# Install dependencies
pnpm install
```

---

## Usage

### HTTP (Streamable) Mode

```bash
npm run serve
# Server starts at http://localhost:3001/mcp
```

### stdio Mode (Claude Desktop)

```bash
node runtime/dist/index.js --stdio
```

**Claude Desktop Configuration**

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "excalidraw": {
      "command": "node",
      "args": ["/path/to/excalidraw-mcp/runtime/dist/index.js", "--stdio"]
    }
  }
}
```

Restart Claude Desktop.

### OpenCode IDE Integration

The Excalidraw MCP Server is fully compatible with OpenCode IDE (terminal, desktop, and IDE extensions).

**Project configuration:** `.opencode.json` (included)

**Setup:**

1. Build the project:
   ```bash
   pnpm install && npm run build
   ```

2. Configure OpenCode (choose one):

   **stdio mode** (terminal/desktop):
   ```json
   {
     "mcp": {
       "excalidraw": {
         "type": "local",
         "command": ["node"],
         "args": ["/path/to/excalidraw-mcp/runtime/dist/index.js", "--stdio"],
         "enabled": true
       }
     }
   }
   ```

   **HTTP mode** (IDE/web):
   ```json
   {
     "mcp": {
       "excalidraw": {
         "type": "http",
         "url": "http://localhost:3001/mcp",
         "enabled": true
       }
     }
   }
   ```

3. Restart OpenCode — the Excalidraw tools will be available.

**Detailed guide:** See [docs/OPENCODE.md](docs/OPENCODE.md)

---

## Development

### Scripts

```bash
pnpm install          # Install dependencies
npm run build         # Production build
npm run dev           # Dev mode (watch + serve)
npm run dev:ui        # Standalone UI only
npm run serve         # HTTP server only
npm run watch         # Vite watch mode
```

### Testing

```bash
npm test              # Run all tests
npm run test:coverage # Run with coverage
```

---

## Build Outputs

The build process generates three key files in `runtime/dist/`:

### Output Files

| File | Size | Purpose |
|------|------|---------|
| `index.js` | ~500KB | MCP server entry point with stdio/HTTP transports |
| `server.js` | ~400KB | Core server library (exportable) |
| `mcp-app.html` | ~1.2MB | Self-contained Excalidraw widget (single HTML file) |

### Build Pipeline

The build is a 5-phase process, cleaned and fully automated:

1. **Type Check** (`tsc --noEmit`)
   - TypeScript type checking, no output
   
2. **UI Build** (`vite build`)
   - Vite bundles React + Excalidraw into self-contained HTML
   - Outputs to `runtime/dist/src/mcp-app.html` (temporary)
   
3. **Move HTML** (cross-platform rename)
   - Moves `mcp-app.html` to `runtime/dist/` root
   - Removes temporary `src/` directory
   
4. **Type Definitions** (`tsc -p tsconfig.server.json`)
   - Generates `.d.ts` type definition files
   
5. **Server Bundle** (`bun build`)
   - Bundles `server.ts` → `server.js` (library export)
   - Bundles `main.ts` → `index.js` (CLI entry point with shebang)

**Run:** `npm run build` (full pipeline) or `npm run watch` (Vite only, for development)

### Using Build Outputs

**As a library:**
```javascript
import { createMcpServer } from './runtime/dist/server.js';
const server = createMcpServer();
```

**As an MCP server (stdio):**
```bash
node runtime/dist/index.js --stdio
```

**As an MCP server (HTTP):**
```bash
npm run serve  # Starts HTTP server at http://localhost:3001/mcp
```

**The widget (mcp-app.html):**
- Served automatically when using HTTP mode
- Or embed directly in any MCP host
- Contains no external dependencies (self-contained)
- Supports fullscreen, checkpoints, and progressive rendering

### Runtime Directories

- `runtime/dist/` — Build outputs (committed to .gitignore)
- `runtime/logs/` — Server logs (ephemeral)
- `runtime/data/` — Checkpoint snapshots (ephemeral)

### What's in mcp-app.html?

The single HTML file contains:
- Excalidraw diagram renderer (SVG-based, no canvas)
- Hand-drawn animation effects (CSS)
- Checkpoint system (localStorage cache)
- Fullscreen mode support
- All dependencies bundled (React, Excalidraw, morphdom)
- Fonts inlined from esm.sh (Virgil font for hand-drawn look)

### Troubleshooting Build

**"Build didn't output to runtime/dist/"**
- Check that `output.outDir: "runtime/dist"` is set in vite.config.ts
- Delete `runtime/dist/` manually and rebuild

**"index.js has wrong shebang"**
- The `--banner` flag in bun build adds Node.js shebang automatically
- Should show `#!/usr/bin/env node` at the top of `index.js`

**"mcp-app.html is huge"**
- Normal! It's self-contained (1.2MB includes React, Excalidraw, fonts)
- Use `npm run watch` to iterate during development without full rebuild

---

## Documentation

- [PROJECT.md](docs/PROJECT.md) — Project overview, installation, usage
- [ROADMAP.md](docs/ROADMAP.md) — Project planning and future roadmap
- [STATE.md](docs/STATE.md) — Current development status
- [AGENTS.md](docs/AGENTS.md) — Agent guidelines for AI assistants
- [OPENCODE.md](docs/OPENCODE.md) — OpenCode IDE integration guide
- [INDEX.md](docs/INDEX.md) — Complete file listing
- [CLAUDE.md](CLAUDE.md) — Architecture and design decisions
- [GitHub MCP Guide](docs/github_mcp.md) — Using GitHub MCP tools

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/).

- **v1.2.2** — Build outputs documentation added (20-Apr-2026)
- **v1.2.1** — OpenCode IDE integration & ROADMAP enhancement (20-Apr-2026)
- **v1.2.0** — README update and release cleanup (20-Apr-2026)
- **v1.1.0** — Documentation updates, AGENTS.md added (20-Apr-2026)
- **v1.0.0** — Initial migration release (19-Apr-2026)

Current version is stored in `.versions/current.txt`.

---

## Release Process

1. Update version in `.versions/current.txt`
2. Update documentation (PROJECT.md, STATE.md, AGENTS.md)
3. Commit: `git commit -m "chore: bump version to vX.Y.Z"`
4. Tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z: description"`
5. Push: `git push origin main && git push origin vX.Y.Z`
6. Create GitHub release from tag

---

## Credits

Built with [Excalidraw](https://github.com/excalidraw/excalidraw) — a virtual whiteboard for sketching hand-drawn like diagrams.

Forked from [excalidraw/excalidraw-mcp](https://github.com/excalidraw/excalidraw-mcp).

---

## License

MIT
