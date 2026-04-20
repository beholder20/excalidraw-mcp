# Excalidraw MCP Server — Project Roadmap

## 📋 Project Overview

The Excalidraw MCP Server is a standalone Model Context Protocol (MCP) server that streams Excalidraw diagrams as SVG with hand-drawn animations. It supports both HTTP (Streamable) and stdio transports, making it compatible with Claude Desktop, VS Code, and any MCP-compatible client.

**Repository:** https://github.com/beholder20/excalidraw-mcp  
**Version:** 1.2.2  
**License:** MIT  
**Forked from:** excalidraw/excalidraw-mcp

---

## 🎯 Project Goals

- ✅ Provide a dedicated, well-documented MCP server for Excalidraw diagramming
- ✅ Preserve full git history during migration from `/skills/` to dedicated project
- ✅ Separate source code (`src/`) from build outputs and runtime artifacts (`runtime/`)
- ✅ Maintain zero data loss and full functionality
- ✅ Support OpenCode IDE and other MCP-compatible clients
- ✅ Follow semantic versioning and professional release practices

---

## 🚀 Current Status (v1.2.2 — 20-Apr-2026)

### Completed Milestones

| Version | Date | Achievements |
|---------|------|-------------|
| **v1.0.0** | 19-Apr-2026 | Migration complete: full git history preserved, build system configured, documentation suite created |
| **v1.1.0** | 20-Apr-2026 | Added AGENTS.md, updated documentation, version tracking synchronized |
| **v1.2.0** | 20-Apr-2026 | README completely rewritten for forked project identity, all docs updated, releases published |
| **v1.2.1** | 20-Apr-2026 | OpenCode IDE integration: .opencode.json + OPENCODE.md guide, ROADMAP enhanced with future planning |
| **v1.2.2** | 20-Apr-2026 | Build outputs documentation: documented runtime/dist/ structure, 5-phase build pipeline, usage examples, troubleshooting |

### Active Development
- **Branch:** `main`
- **Commits:** 65+ (including full migration history)
- **Tags:** v1.0.0, v1.1.0, v1.2.0, v1.2.1, v1.2.2
- **Releases:** All five versions published on GitHub

---

## 📈 Future Roadmap

### v1.3.0 — Testing & Quality (Planned)
- [ ] Add unit tests for core components (checkpoint stores, element parsing)
- [ ] Add integration tests for MCP tool responses
- [ ] Configure CI/CD pipeline (GitHub Actions)
- [ ] Add ESLint and Prettier configuration
- [ ] Set up code coverage reporting (target: 80%+)
- [ ] Add end-to-end tests with Playwright

### v1.4.0 — Feature Enhancements (Planned)
- [ ] Support for additional Excalidraw element types
- [ ] Improved checkpoint management UI
- [ ] Export options: PNG, SVG, JSON
- [ ] Diagram templating system
- [ ] Batch element creation
- [ ] Performance optimizations for large diagrams

### v2.0.0 — Major Release (Future)
- [ ] Upgrade to latest Excalidraw SDK
- [ ] Refactor architecture for plugin system
- [ ] Add support for MCP Apps extension features
- [ ] Consider WebSocket transport for real-time collaboration
- [ ] Evaluate Vercel deployment optimizations

---

## 🔧 OpenCode IDE Compatibility

### Current Status
✅ **Integrated** — OpenCode IDE support was added in v1.2.1:

- Project-level `.opencode.json` configuration
- Comprehensive `docs/OPENCODE.md` guide (700+ lines)
- Tested with terminal, desktop, and IDE extension modes
- Multi-session development workflow documented

### OpenCode-Specific Setup

**As an OpenCode project**, excalidraw-mcp-build:

1. **Located in OpenCode workspace** (`/home/anudeep/Documents/AI_content/AntiGravity/`)
2. **Git-integrated** — Full commit history preserved, tags managed
3. **MCP server** — Can be registered in OpenCode's `opencode.json` for seamless use
4. **Skill-compatible** — Follows MCP protocol standards

### Recommended OpenCode Configuration

Add to OpenCode workspace config (`skills/opencode.json` or project-level):

```json
{
  "mcp": {
    "excalidraw": {
      "type": "local",
      "command": ["node", "/path/to/excalidraw-mcp/runtime/dist/index.js"],
      "args": ["--stdio"],
      "enabled": true
    }
  }
}
```

**For HTTP mode:**
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

### OpenCode Development Workflow

```bash
# 1. Clone and setup
git clone https://github.com/beholder20/excalidraw-mcp.git
cd excalidraw-mcp
pnpm install

# 2. Build
npm run build

# 3. Run in stdio mode (for OpenCode terminal/desktop)
node runtime/dist/index.js --stdio

# 4. Or run HTTP mode (for OpenCode web/IDE)
npm run serve
# Then configure OpenCode to use http://localhost:3001/mcp
```

---

## 🏗️ Architecture Overview

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Widget Core** | `src/mcp-app.tsx` | ExcalidrawAppCore component, SVG rendering |
| **Entry Point** | `src/mcp-entry.tsx` | Production entry, creates React root |
| **Dev Mode** | `src/dev.tsx` | Development entry with mock app and controls |
| **Server** | `main.ts` | HTTP server + stdio transport handler |
| **API Layer** | `api/` | MCP tool handlers and resource management |
| **Checkpoint Store** | `src/checkpoint/*` | File/Memory/Redis storage backends |
| **Styles** | `src/global.css` | Animations (stroke draw-on, fade-in) |

### Data Flow

```
User Prompt → MCP Client → Server (stdio/HTTP) → Tool Handler
    → create_view(elements) → Excalidraw SVG → morphdom diff
    → PNG screenshot → Model context → User sees diagram
```

### Rendering Pipeline

1. **Streaming:** Partial JSON parsed → `parsePartialElements` → re-render on element count change
2. **Final:** Complete JSON → stable seeds → `exportToSvg` → morphdom → PNG capture
3. **Animations:** CSS keyframes (fade-in for shapes, stroke-dashoffset for lines)
4. **Checkpoints:** Server-side store + localStorage widget cache

---

## 📊 Release Cadence

- **Patch releases (x.y.Z):** Bug fixes, documentation updates, minor improvements
- **Minor releases (x.Y.0):** New features, backward-compatible changes, enhanced docs
- **Major releases (X.0.0):** Breaking changes, architecture updates, major feature sets

**Current cycle:** Minor releases (v1.x) — migration stabilization and documentation improvements

---

## 🔄 Migration History

### Phase A: Core Migration (Completed v1.0.0)
- ✅ Backup & verification of source
- ✅ Clean destination setup
- ✅ Full git history preservation (all commits, branches, tags)
- ✅ Critical files verified
- ✅ Dependencies installed (pnpm@10.11.0)

### Phase B: Configuration & Build (Completed v1.0.0)
- ✅ Build config updated: `runtime/dist/` output
- ✅ `.gitignore` excludes `runtime/`
- ✅ Build successful, server tested in both modes
- ✅ Auto-sizing and fullscreen verified

### Phase C: Documentation (Completed v1.1.0)
- ✅ PROJECT.md, INDEX.md, ROADMAP.md, STATE.md created
- ✅ AGENTS.md added (v1.1.0)
- ✅ Version tracking implemented
- ✅ GitHub releases published

### Phase D: OpenCode Integration (Planned v1.4.0)
- ⏳ OpenCode workspace configuration
- ⏳ IDE integration documentation
- ⏳ Skill examples and templates

---

## 🎯 Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Git history preserved | 100% | ✅ 100% |
| Build success rate | 100% | ✅ 100% |
| Documentation coverage | All features | ✅ Complete |
| OpenCode compatibility | Full support | ✅ Compatible |
| Test coverage | ≥80% | ⏳ Not started |
| Release automation | CI/CD | ⏳ Planned |
| Community adoption | Stars/forks | ⏳ Tracking |

---

## 📅 Timeline

| Date | Milestone |
|------|-----------|
| 19-Apr-2026 | v1.0.0 — Migration release (complete) |
| 20-Apr-2026 | v1.1.0 — Documentation updates (complete) |
| 20-Apr-2026 | v1.2.0 — README rewrite & release cleanup (complete) |
| 20-Apr-2026 | v1.2.1 — OpenCode IDE integration (complete) |
| 20-Apr-2026 | v1.2.2 — Build outputs documentation (complete) |
| Q2 2026 | v1.3.0 — Testing & CI/CD (planned) |
| Q3 2026 | v1.4.0 — Feature enhancements (planned) |
| Future | v2.0.0 — Major architecture update (TBD) |

---

## 🛠️ Dependencies & Requirements

### Build Dependencies
- **Node.js:** v18+ (recommended: v20+)
- **pnpm:** v10.11.0 (enforced in package.json)
- **Bun:** Optional, for faster builds

### Runtime Dependencies
- **Excalidraw SDK:** `@excalidraw/excalidraw`
- **MCP SDK:** `@modelcontextprotocol/sdk`
- **Vite:** Build tooling
- **TypeScript:** Type safety

### Optional Services
- **Redis:** For distributed checkpoint storage (Vercel/production)
- **Vercel:** Deployment target for HTTP mode

---

## 🐛 Known Issues & Limitations

1. **GitHub Release API:** Encountered HTTP 500 errors during initial automation; manual release creation fallback works
2. **No tests yet:** Test suite not implemented (planned for v1.3.0)
3. **README upstream:** Original README references upstream repo; project-specific README now in place
4. **Claude Desktop config:** Users must manually update their config to point to new path

---

## 📚 Documentation Index

| Document | Purpose | Status |
|----------|---------|--------|
| `README.md` | Project overview, quick start | ✅ Current (v1.2.2) |
| `docs/PROJECT.md` | Detailed project info, installation, usage | ✅ Current |
| `docs/ROADMAP.md` | This document — project planning & milestones | ✅ Current |
| `docs/STATE.md` | Current development status, decisions, learning | ✅ Current |
| `docs/AGENTS.md` | Agent guidelines for AI assistants | ✅ Current (v1.2.2) |
| `docs/INDEX.md` | Complete file listing | ✅ Current |
| `docs/github_mcp.md` | GitHub MCP tools reference | ✅ Current |
| `CLAUDE.md` | Architecture & design decisions | ✅ Current |
| `RELEASE_NOTES_v*.md` | Version-specific release notes | ✅ For v1.0.0–v1.2.2 |

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Development setup:**
```bash
pnpm install
npm run dev      # Dev mode with watch
npm run build    # Production build
npm test         # Run tests (when available)
```

**Code style:** Follow existing patterns in `src/`. Use TypeScript strict mode. Comment complex logic.

---

## 📄 License

MIT — See `LICENSE` file for details.

---

## 🙏 Acknowledgments

- **Excalidraw** — Virtual whiteboard for hand-drawn style diagrams
- **Model Context Protocol** — MCP specification and ecosystem
- **OpenCode** — Open source AI coding agent inspiring this project structure
- **Community** — MCP server developers and early adopters

---

*Last Updated: 20-Apr-2026 | Version: 1.2.0 | Status: Active Development*
