# AGENTS.md - Agent Guidelines for Excalidraw MCP Server

**Version:** 1.2.0  
**Last Updated:** 20-Apr-2026  
**Project:** Excalidraw MCP Server  
**Repository:** https://github.com/beholder20/excalidraw-mcp

---

## 🚀 Quick Start for Agents

This document provides guidelines for AI agents working on the Excalidraw MCP Server project. Always check these project docs first:

- `docs/PROJECT.md` - Project scope, installation, usage
- `docs/STATE.md` - Current development status and progress
- `docs/ROADMAP.md` - Project roadmap and phases
- `docs/INDEX.md` - Complete file listing
- `.versions/current.txt` - Current version

---

## 📋 Essential Checks (Run at Start of Every Session)

### Project Documentation
- ✅ Check `docs/PROJECT.md` for project scope and progress
- ✅ Check `docs/STATE.md` for current status and recent learning
- ✅ Check `docs/ROADMAP.md` for phase completion and next actions
- ✅ Check `docs/INDEX.md` for file structure
- ✅ Read `.versions/current.txt` for current version

### Tool Configuration
- ✅ Use **Brave MCP** (`brave`) for all web search tasks
- ✅ Use **GitHub MCP** for all GitHub operations
- ✅ Use **Context7 MCP** to search project documentation
- ✅ CocoIndex is available for codebase queries (if `.cocoignore` exists)

---

## 🔄 Auto-Update Protocol (MANDATORY)

After every meaningful execution step, update project files in this order:

### 1. `docs/STATE.md` (FIRST)
- Update **Current Focus** to reflect completed action
- Update **Status** (In Progress / Completed / Blocked)
- Update **Progress Bar** to reflect actual progress
- Add insights to **Recent Learning**
- Update **Last Session** with one-line summary
- Update **Next Actions** with what comes next
- Move resolved items from **Open Questions** / **Blocked Items**

### 2. `docs/PROJECT.md` (SECOND)
- Check off completed items in **Requirements → Active**
- Add new requirements discovered during implementation
- Update **Key Decisions** table with outcomes
- Update **Last updated** timestamp and event description

### 3. `docs/ROADMAP.md` (THIRD)
- Check off completed plans in current phase
- Update **Progress** table (recalculate percentage, update status)
- Move to next phase if current phase is complete

### 4. `docs/STATE.md` (FOURTH - already updated in step 1)
- Ensure all changes are reflected

**Rules:**
- Silent execution: Do NOT announce updates
- Minimal writes: Only update fields that changed
- Always update timestamps
- Create files if missing (use templates from AGENTS.md)

---

## 🛠️ Project-Specific Information

### Build/Lint/Test Commands

```bash
# Install dependencies
pnpm install

# Build for production
npm run build

# Development modes
npm run dev          # Watch mode + serve (full MCP flow)
npm run dev:ui       # Standalone UI mode (no MCP server)
npm run serve        # HTTP mode only
npm run watch        # Vite watch mode only

# Testing (if tests exist)
npm test
npm run test:coverage
```

### Code Style Guidelines

- **Language:** TypeScript with React
- **Framework:** Excalidraw SDK
- **Build Tool:** Vite + Bun
- **Formatting:** Follow existing code style in src/
- **Imports:** Group standard library, third-party, local
- **Comments:** Explain WHY, not WHAT; comment complex logic only
- **Line Length:** Max 100 characters

### Project Structure

```
excalidraw-mcp-build/
├── src/                    # TypeScript/React source code
│   ├── mcp-app.tsx        # Widget core component
│   ├── mcp-entry.tsx      # Production entry point
│   ├── dev.tsx            # Dev mode entry
│   └── global.css         # Animations
├── api/                   # API/server layer
├── scripts/               # Build automation scripts
├── runtime/               # Build outputs (dist/, logs/, data/)
├── docs/                  # Project documentation
│   ├── PROJECT.md
│   ├── INDEX.md
│   ├── ROADMAP.md
│   ├── STATE.md
│   └── AGENTS.md          # This file
├── .versions/             # Version tracking
│   └── current.txt
├── package.json           # Dependencies (pnpm@10.11.0)
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── CLAUDE.md              # Architecture and design decisions
```

### Testing Standards

- **Coverage:** Minimum 80% overall, 85% for new code
- **Test Types:** Unit, Integration, E2E, Performance
- **Frameworks:** Use project-standard testing tools (to be configured)

---

## 🔐 Security Protocols

### Pre-Release Security Gate (MANDATORY)

Before any release or production deployment:

```bash
# Scan entire repository for secrets
git secrets --scan -r

# Scan commit history for any leaked secrets
git secrets --scan-history

# If any secrets found, DO NOT RELEASE
# Rotate all exposed keys immediately
```

**All releases must pass secret detection with zero findings.**

### Environment File Protection

- `.env` files MUST be in `.gitignore` (already configured)
- Never commit secrets, API keys, or credentials
- Use environment variables only: `process.env.VAR_NAME`
- Validate required environment variables at startup

### Safe Configuration Pattern

```typescript
// ✓ Load from environment only
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not set');
}

// ✗ Never hardcode secrets
// const apiKey = 'sk-proj-...';  // FORBIDDEN
```

---

## 🏗️ Architecture & Design Patterns

### Design Principles
- SOLID Principles implementation
- Separation of concerns
- Dependency injection where appropriate
- Event-driven architecture for MCP communication

### Required Patterns
- Repository pattern for data access (checkpoint stores)
- Factory pattern for store creation (`createVercelStore`)
- Observer pattern for event handling
- Strategy pattern for storage backends (File, Memory, Redis)

---

## 🛠️ Available Tools & Integrations

### Core Tools
- **Version Control:** Git with tagging and branching strategies
- **Documentation:** Markdown-based (this file structure)
- **CI/CD:** GitHub Actions (to be configured)
- **Code Quality:** ESLint, Prettier (to be configured)
- **Testing:** Playwright or framework-specific tools
- **Container:** Docker (optional)
- **Infrastructure:** Vercel (deployment target)

### MCP Servers
- **Brave Search:** For web searches
- **GitHub:** For repository operations
- **Context7:** For documentation search
- **CocoIndex:** For codebase queries (AST-based semantic search)

---

## 📦 Release Management

### Version Tracking
- Current version stored in `.versions/current.txt`
- Git tags follow semantic versioning: `v1.0.0`, `v1.1.0`, etc.
- Release notes prepared in `RELEASE_NOTES_v<version>.md`

### Release Process
1. Update `.versions/current.txt` with new version
2. Update `docs/PROJECT.md` version and last updated date
3. Update `docs/STATE.md` with release summary
4. Commit changes with message: `chore: bump version to v<version>`
5. Create annotated git tag: `git tag -a v<version> -m "Release v<version>: <description>"`
6. Push tag: `git push origin v<version>`
7. Push commits: `git push origin main`
8. Create GitHub release from tag (API or manual)

**Note:** GitHub release API has been encountering HTTP 500 errors; manual release creation from tag is recommended.

---

## 📚 Documentation Standards

### Required Documentation
- **API Documentation:** Tools `read_me` and `create_view` (see CLAUDE.md)
- **Architecture Decision Records:** CLAUDE.md contains design decisions
- **Runbooks:** Not yet created
- **Security Playbooks:** See this file for secret management
- **Code Comments:** Follow existing patterns in src/

### README Template
The project README.md should include:
- Project name and brief description
- Version reference from `.versions/current.txt`
- Installation instructions
- Usage examples
- Testing commands
- Links to documentation in `docs/`
- Contributing guidelines
- License (MIT)

---

## 🔍 Code Review Checklist

Before any code deployment, verify:

| Category | Check | Status |
|----------|-------|--------|
| Security | No hardcoded secrets | ☐ |
| Security | Input validation present | ☐ |
| Performance | Code follows project patterns | ☐ |
| Reliability | Error handling complete | ☐ |
| Testing | Tests pass (if applicable) | ☐ |
| Documentation | Related docs updated | ☐ |

---

## 🐛 Issue Resolution Workflow

1. **Identify issue** - Search codebase with CocoIndex or GitHub search
2. **Create branch** - Use descriptive name: `bugfix/<description>` or `feature/<description>`
3. **Implement fix** - Follow code style guidelines
4. **Test changes** - Run existing tests, add new tests if needed
5. **Update documentation** - Reflect changes in docs
6. **Open PR** - Create pull request with clear description
7. **Address review** - Incorporate feedback
8. **Merge** - Squash and merge to main
9. **Tag release** - If applicable, create version tag

---

## 📊 Monitoring & Observability

### Logging
- Use the SDK logger: `app.sendLog({ level: "info", logger: "Excalidraw", data: "message" })`
- Log levels: `info`, `warn`, `error`
- Never log sensitive data (secrets, tokens, PII)

### Health Checks
- Server responds to MCP initialize requests
- HTTP mode listens on port 3001
- Check server logs for errors

---

## 🚨 Incident Response

### Severity Levels
- **Sev-1:** Complete service outage, no workaround
- **Sev-2:** Major feature unavailable
- **Sev-3:** Minor feature broken with workaround
- **Sev-4:** Documentation or non-critical issues

### Response Steps
1. Assess impact and severity
2. Check logs and error messages
3. Verify recent changes (git log)
4. Rollback if needed: `git revert <commit>` or `git reset --hard <tag>`
5. Document incident in `docs/STATE.md`
6. Create issue for tracking

---

## 🎯 Performance & Scalability

### Baselines
- API response time: <200ms for 95th percentile
- Memory usage: <80% of allocated resources
- CPU usage: <70% under normal load

### Optimization Patterns
- Use memoization for expensive calculations
- Implement proper cleanup in useEffect hooks
- Minimize re-renders with React.memo, useMemo, useCallback
- Batch state updates when possible

---

## 🤖 Multi-Agent Coordination

When multiple agents work on this project:
- Use shared context template (see below)
- Synchronize before major changes
- Escalate conflicts to humans
- Document decisions in `docs/STATE.md` and `docs/ROADMAP.md`

### Shared Context Template

```yaml
project:
  name: "excalidraw-mcp"
  version: "1.2.0"
  status: "active-development"

architecture:
  pattern: "mcp-server"
  components: ["widget", "api", "checkpoint-store"]

security:
  last_audit: "2026-04-20"
  vulnerabilities: []
  compliance: []

performance:
  rendering: "SVG with morphdom"
  storage: "File/Memory/Redis"

recent_changes:
  - "README update for v1.2.0"
  - "Version bump and release cleanup"
```

---

## 📝 Version History

- **v1.2.0** (20-Apr-2026): README update and release cleanup
- **v1.1.0** (20-Apr-2026): Documentation updates, AGENTS.md added
- **v1.0.0** (19-Apr-2026): Initial migration release

---

*This AGENTS.md is tailored for the Excalidraw MCP Server project. For general agent guidelines, see `/home/anudeep/.config/opencode/AGENTS.md`.*