# Excalidraw MCP Server

Standalone MCP server that streams Excalidraw diagrams as SVG with hand-drawn animations.

**Version:** 1.1.0  
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

### Development Modes

```bash
# Full MCP flow with watch mode
npm run dev

# Standalone UI (no MCP server)
npm run dev:ui
# Opens http://localhost:5173/index-dev.html

# Build only
npm run build
```

---

## Tools

### `read_me`

Returns a cheat sheet with element format, color palettes, coordinate tips, and examples. Call this before `create_view`.

### `create_view`

Takes an `elements` JSON string (standard Excalidraw element format) and renders a diagram. Supports streaming partial updates during generation, then sends a PNG screenshot to the model context for verification.

---

## Build & Runtime

- **Build Tool:** Vite + Bun (optional, for faster builds)
- **Output:** `runtime/dist/`
- **Entry Point:** `runtime/dist/index.js`
- **Runtime Artifacts:** `runtime/logs/`, `runtime/data/`
- **Dependencies:** Managed by pnpm@10.11.0

---

## Documentation

- [PROJECT.md](docs/PROJECT.md) — Project overview, installation, usage
- [ROADMAP.md](docs/ROADMAP.md) — Migration phases and progress
- [STATE.md](docs/STATE.md) — Current development status
- [AGENTS.md](docs/AGENTS.md) — Agent guidelines for this project
- [INDEX.md](docs/INDEX.md) — Complete file listing
- [CLAUDE.md](CLAUDE.md) — Architecture and design decisions
- [GitHub MCP Guide](docs/github_mcp.md) — Using GitHub MCP tools

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

## Versioning

This project follows [Semantic Versioning](https://semver.org/).

- **v1.0.0** — Initial migration release (19-Apr-2026)
- **v1.1.0** — Documentation updates, AGENTS.md added (20-Apr-2026)
- **v1.2.0** — README update and release cleanup (20-Apr-2026)

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
