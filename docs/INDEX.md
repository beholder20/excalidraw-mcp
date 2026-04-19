# Project File Index

This file lists all the files and directories in the excalidraw-mcp-build project.

## Root Directory
- `api/` - API layer
- `docs/` - Documentation directory
- `scripts/` - Build and automation scripts
- `src/` - Source code
- `runtime/` - Build outputs and runtime artifacts
- `node_modules/` - Dependencies
- `.git/` - Git repository data
- `.gitignore` - Git ignore rules
- `.npmrc` - NPM configuration
- `.mcpbignore` - MCP build ignore rules
- `CLAUDE.md` - Architecture and design decisions
- `index-dev.html` - Development HTML entry point
- `manifest.json` - MCP manifest
- `package.json` - Dependencies and scripts
- `pnpm-lock.yaml` - Locked dependency versions
- `QUICK_REFERENCE.txt` - Quick reference guide
- `README.md` - Project overview
- `tsconfig.json` - TypeScript configuration
- `tsconfig.server.json` - TypeScript configuration for server
- `vercel.json` - Vercel deployment configuration
- `vite.config.dev.ts` - Development Vite configuration
- `vite.config.ts` - Production Vite configuration
- `EXPLORATION_INDEX.md` - Exploration index (from analysis)
- `FILE_MANIFEST.md` - File manifest (from analysis)
- `MIGRATION_EXPLORATION_REPORT.md` - Migration exploration report (from analysis)
- `mcp-debug.log` - Debug log

## Docs Directory
- `PROJECT.md` - Project scope and progress
- `INDEX.md` - This file (list of project files)
- `REQUIREMENTS.md` - Primary value proposition and key objectives
- `ROADMAP.md` - Project roadmap, phases, dependencies, requirements, plans, success criteria
- `STATE.md` - Current state and phase accomplishments
- `demo.gif` - Demonstration animation
- `logo.png` - Project logo

## Source Code Structure (src/)
- `main.ts` - HTTP and stdio transports entry point
- `server.ts` - MCP server implementation with tools
- `mcp-app.tsx` - Excalidraw application core (widget logic)
- `mcp-entry.tsx` - Production entry point
- `dev.tsx` - Development entry point with mock app
- `dev-mock.ts` - Mock MCP app with event simulation
- `global.css` - Animations and auto-resize styles
- `checkpoint-store.ts` - Checkpoint storage implementations
- `edit-context.ts` - Edit context handling
- `pencil-audio.ts` - Pencil audio functionality
- `sounds.ts` - Sound effects

## API Layer (api/)
- `mcp.ts` - MCP API implementation

## Scripts (scripts/)
- `build.mjs` - Build script
- `setup-bun.mjs` - Bun setup script

## Runtime Artifacts (runtime/)
- `dist/` - Compiled JavaScript/HTML output
- `logs/` - Runtime logs
- `data/` - Session state and snapshots

## Documentation Files
This INDEX.md file itself