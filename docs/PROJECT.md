# Excalidraw MCP App Server

Standalone MCP server that streams Excalidraw diagrams as SVG with hand-drawn animations.

**Version:** 1.2.2  
**Last Updated:** 20-Apr-2026  
**Last Migration:** Core migration from skills/ to dedicated project directory completed on 19-Apr-2026

## Features

- Streams Excalidraw diagrams as SVG with hand-drawn animations
- Provides two MCP tools: `read_me` (cheat sheet) and `create_view` (diagram creation)
- Implements checkpoint system for diagram state persistence
- Supports both HTTP (Streamable) and stdio transports
- Includes auto-sizing, fullscreen mode, and progressive element ordering
- Uses SVG-only rendering with morphdom for efficient updates

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd excalidraw-mcp-build

# Install dependencies
pnpm install

# Setup environment (if needed)
# No special environment variables required for basic operation
```

## Usage

```bash
# HTTP (Streamable) mode - default, stateless per-request
npm run serve          # or: bun --watch main.ts
# Starts on http://localhost:3001/mcp

# stdio mode — for Claude Desktop
node runtime/dist/index.js --stdio

# Dev mode (watch + serve) — full MCP flow
npm run dev

# Dev mode (standalone UI) — no MCP server needed
npm run dev:ui
# Opens http://localhost:5173/index-dev.html with mock app + sample diagram
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --testNamePattern="pattern"
```

## Documentation

- [API Documentation](docs/API.md) - TODO: Create
- [Architecture Overview](docs/ARCHITECTURE.md) - See CLAUDE.md
- [Deployment Guide](docs/DEPLOYMENT.md) - TODO: Create
- [Security Practices](docs/SECURITY.md) - TODO: Create
- [Release Notes](CHANGELOG.md) - TODO: Create

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

MIT