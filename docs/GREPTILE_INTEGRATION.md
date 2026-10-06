# CREED OS — Greptile & MCP Integration Guide

This guide documents the implementation of **Greptile** for AI-native pull request reviews, codebase graph intelligence, and Model Context Protocol (MCP) tooling across the CREED OS monorepo.

---

## 1. Overview & Architecture

Greptile indexes the full repository into an AST-aware knowledge graph, enabling context-rich PR reviews that understand cross-package relationships, type dependencies, and architectural invariants.

### Key Architectural Invariants Enforced by Greptile

1. **Strict `pnpm` Monorepo Policy:** Zero tolerance for `npm`, `npx`, or `yarn`. All tools must use `pnpm dlx`.
2. **Deterministic Psychometrics:** Scoring and ability estimation ($\theta$, SE) must be computed by deterministic algorithms (3PL IRT with Gauss-Hermite EAP quadrature, BKT), never by unconstrained LLMs.
3. **DPDP Act & Minor Safety:** Verified parental consent state machine gating (`DRAFT` → `PARENT_INVITED` → `PARENT_CONSENT_PENDING` → `PARENT_CONSENTED`), relationship-scoped Supabase RLS, and ephemeral AI prompts with zero training retention.
4. **Svelte 5 Runes:** Strict usage of `$props()`, `$state()`, `$derived()`, and `$effect()`. Legacy Svelte 4 syntax (`export let`, `$:`) is rejected.
5. **WAY Design System Tokens:** Zero rounded corners (`rounded-none`), semantic OKLCH tokens (`--surface-canvas`, `--surface-raised`, `--text-primary`, `--accent-cyan`), strict 8pt spacing rhythm, and no glowing cyber-neon drop shadows.
6. **Effect Domain Pipelines:** Complex domain logic and assessment workflows must use Effect with `Data.TaggedError` and generator composition.

---

## 2. Cascading `.greptile/` Directory Structure

Greptile uses directory-scoped configuration with cascading inheritance. Child directories inherit settings from parents and apply specialized overrides.

```
c:/learning/
├── .greptile/                    # Monorepo root defaults
│   ├── config.json               # Review settings, strictness, output sections, global rules
│   ├── rules.md                  # Comprehensive architectural standards with code examples
│   └── files.json                # Cross-repo context files (AGENTS.md, ARCHITECTURE.md, etc.)
│
├── packages/
│   ├── assessment/
│   │   └── .greptile/            # Strictness 1 (Apex tier), 3PL IRT parameter bounds, EAP quadrature
│   │       ├── config.json
│   │       ├── rules.md
│   │       └── files.json
│   │
│   └── domain/
│       └── .greptile/            # Strictness 2, Effect pipelines, DPDP consent transitions
│           ├── config.json
│           ├── rules.md
│           └── files.json
│
└── apps/
    └── web/
        └── .greptile/            # Strictness 2, Svelte 5 runes, WAY Design System zero-radius
            ├── config.json
            ├── rules.md
            └── files.json
```

### Precedence & Merging
- **Settings (Strictness, Comment Types):** Strictest wins or directory-closest value overrides.
- **Rules (`config.json` rules & `rules.md`):** Parent rules and child rules accumulate.
- **Context (`files.json`):** Parent and child files accumulate into the reviewer's context.

---

## 3. Model Context Protocol (MCP) Configuration

Greptile provides an HTTP-transport MCP server at:
```
https://api.greptile.com/mcp
```

### Supported IDE & Agent Configurations

#### 1. Universal / Claude Code (`.mcp.json`)
Located at the monorepo root:
```json
{
  "mcpServers": {
    "greptile": {
      "type": "http",
      "url": "https://api.greptile.com/mcp"
    }
  }
}
```

#### 2. Cursor IDE (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "greptile": {
      "url": "https://api.greptile.com/mcp"
    }
  }
}
```

#### 3. VS Code (`.vscode/mcp.json`)
```json
{
  "servers": {
    "greptile": {
      "type": "http",
      "url": "https://api.greptile.com/mcp"
    }
  }
}
```

#### 4. Codex CLI (`.codex/config.toml`)
```toml
[mcp_servers.greptile]
url = "https://api.greptile.com/mcp"
```

#### 5. Antigravity IDE (`.agents/plugins/greptile/`)
The native Antigravity workspace plugin provides:
- Manifest: `.agents/plugins/greptile/plugin.json`
- MCP Server: `.agents/plugins/greptile/mcp_config.json`
- Skill: `.agents/plugins/greptile/skills/greptile/SKILL.md`
- Governance: `.agents/plugins/greptile/rules/greptile.md`

### Testing MCP Connectivity
Verify connection to Greptile MCP at any time:
```bash
pnpm dlx tsx scripts/greptile/mcp-client.ts
```

---

## 4. MCP Tools Reference

When interacting with Greptile via your AI assistant, the following tools are available:

| Tool Name | Scope | Purpose |
| :--- | :--- | :--- |
| `get_me` | Account | Discover authenticated user and accessible organizations. |
| `list_repositories` | Repositories | List enrolled repositories and review status. |
| `list_pull_requests` | PR Management | List active PRs filtered by branch, author, or state. |
| `list_merge_request_comments` | Reviews | Fetch unresolved comments, line numbers, and suggestions. |
| `get_pull_request_review` | Reviews | Get complete review summary, score, and diagram. |
| `list_custom_context` | Standards | View organizational coding standards and patterns. |
| `create_custom_context` | Standards | Add new team rules (e.g., scoping to `apps/web/**`). |
| `search_comments` | Analytics | Search review feedback across historical PRs. |

---

## 5. Developer PR Review & Auto-Fix Workflows

### Triggering Reviews in GitHub
In any PR discussion thread, mention:
```text
@greptileai
```
Or ask targeted questions:
```text
@greptileai check for DPDP consent leaks
@greptileai verify Svelte 5 runes compliance
@greptileai review the 3PL IRT quadrature numerical stability
```

### Auto-Fix Workflow in Editor / Agent
Ask your assistant:
```text
List unaddressed Greptile comments on this PR with suggested fixes, and apply them.
```
The assistant will:
1. Call `list_merge_request_comments` with `addressed: false`.
2. Inspect the suggested code diff against CREED OS invariants.
3. Apply changes and run `pnpm run check` and `pnpm test`.
4. Commit the changes. Once pushed, Greptile marks the comments as `addressed: true`.

---

## 6. Local Review CLI Commands

CREED OS includes pre-configured package scripts for local terminal reviews:

```bash
# Review current branch against master
pnpm run greptile:review

# Review with diff layout
pnpm dlx greptile review --diff

# Check review status for current commit
pnpm run greptile:status

# Inspect effective resolved configuration
pnpm run greptile:config
```

---

## 7. Continuous Integration (GitHub Actions)

The workflow `.github/workflows/greptile-review.yml` executes on every PR:
1. Enforces strict `pnpm install --frozen-lockfile`.
2. Runs monorepo-wide type checks (`pnpm run check`).
3. Runs the complete test suite (`pnpm test`).
4. Checks Greptile review status when `GREPTILE_API_KEY` is configured in repository secrets.
5. Posts actionable guidance if checks fail.
