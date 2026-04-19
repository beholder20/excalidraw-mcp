# Migration Roadmap: Excalidraw MCP Server to Dedicated Project

## Overview
Migrate the Excalidraw MCP Server from `/skills/excalidraw-mcp-server` to `/excalidraw-mcp-build` as a dedicated project directory, preserving git history and separating source code from build/runtime artifacts.

## Goal
- Consolidate MCP server into a dedicated project directory for enhanced development
- Preserve full git commit history
- Separate source code (`src/`) from build outputs and runtime artifacts (`runtime/`)
- Maintain all functionality with zero data loss

## Phases

### Phase A: Core Migration (Execute Now)
**Status**: ✅ Completed

#### Step 1: Backup & Verification
- [x] Create backup of source: `cp -r skills/excalidraw-mcp-server skills/excalidraw-mcp-server.backup.$(date +%Y%m%d-%H%M%S)`
- [x] Verify source git status is clean
- [x] Document git state (log, branches, tags)

#### Step 2: Clean Destination
- [x] Remove existing content in `excalidraw-mcp-build/` (ephemeral artifacts only)
- [x] Verify destination is empty

#### Step 3: Core Migration
- [x] Copy source files and `.git` directory to destination
- [x] Verify git history preserved

#### Step 4: Verify Migration
- [x] Check git log, branches, tags match backup
- [x] Verify critical files exist (src/, package.json, CLAUDE.md, etc.)

#### Step 5: Install Dependencies
- [x] Run `pnpm install` in destination
- [ ] (Defer build test to Phase B)

### Phase B: Configuration & Build (After Phase A Verification)
**Status**: ✅ Completed

#### Step 6: Update Build Configuration
- [x] Modify `vite.config.ts` to output to `runtime/dist/`
- [x] Update `scripts/build.mjs` to use `runtime/dist/`
- [x] Add `runtime/` to `.gitignore`

#### Step 7: Build Test
- [x] Run `npm run build` and verify output in `runtime/dist/`
- [x] Test server startup (both HTTP and stdio modes)

#### Step 8: Optional Cleanup
- [ ] Archive old source location (optional)
- [ ] Remove old source after verification (optional)

#### Step 9: Post-Migration Tasks
- [ ] Update Claude Desktop config to point to new path
- [ ] Document migration completion

## Success Criteria
- [x] Git history fully preserved (all commits, branches, tags)
- [x] Source code accessible at `/excalidraw-mcp-build/src/`
- [x] Build outputs directed to `/excalidraw-mcp-build/runtime/dist/`
- [x] Runtime artifacts (logs, data) stored in `/excalidraw-mcp-build/runtime/`
- [x] `.gitignore` excludes `runtime/` directory
- [x] All dependencies install successfully
- [x] Build completes without errors
- [x] Server starts successfully in both HTTP and stdio modes

## Dependencies
- pnpm@10.11.0 (enforced in package.json)
- Node.js (version compatible with dependencies)
- Bun (optional, for faster builds)

## Rollback Plan
If any step fails, restore from backup:
```bash
cd /home/anudeep/Documents/AI_content/AntiGravity
rm -rf excalidraw-mcp-build
cp -r skills/excalidraw-mcp-server.backup.* excalidraw-mcp-build
```

## Notes
- All artifacts in `excalidraw-mcp-build/` (data/, diagnostics/, logs/) are ephemeral and safe to remove
- Migration preserves all git history; no commits are lost
- Build scripts have been updated in Phase B to separate source from artifacts