---
name: greptile
description: >-
  Interact with Greptile's code review and repository intelligence platform.
  Use to inspect pull request reviews, list unaddressed comments, apply automated code suggestions,
  query codebase knowledge bases, manage team coding standards (custom context), and run local reviews.
---

# Greptile Integration Skill for CREED OS

This skill guides the agent in using Greptile for automated PR review analysis, auto-fixing code review comments, and interacting with Greptile's Model Context Protocol (MCP) server.

---

## 1. Authentication & Initialization

The Greptile MCP server endpoint is:
`https://api.greptile.com/mcp`

### Discovering Identity & Organizations
Always start by checking identity if organizations are unknown:
- **Tool:** `get_me`
- **Output:** Returns user email, account type (`USER` or `API_KEY`), and accessible organizations (`id`, `handle`, `name`).
- If an account belongs to multiple organizations, specify the organization handle on subsequent calls.

### Listing Enrolled Repositories
- **Tool:** `list_repositories`
- **Output:** Returns namespace IDs, repository names, remote providers (`github`, `gitlab`), and default branches.

---

## 2. Pull Request Review Workflows

### Listing Pull Requests
- **Tool:** `list_pull_requests` / `list_merge_requests`
- Filter by `name: "owner/repo"`, `state: "open"`, or `authorLogin`.

### Fetching Review Comments & Issues
- **Tool:** `list_merge_request_comments` with parameters:
  - `name`: repository name (`owner/repo`)
  - `number`: PR number
  - `addressed`: `false` (to retrieve only unaddressed feedback)
  - `remote`: `github`
  - `defaultBranch`: `master`

### Anatomy of a Comment
Each comment returned contains:
- `isGreptileComment`: `true`
- `addressed`: `false`
- `filePath`: relative path to the affected file
- `lineStart`, `lineEnd`: line coordinates
- `hasSuggestion`: `true` when a code replacement is provided
- `suggestedCode`: exact replacement code snippet
- `body`: explanation of the rationale / invariant violation

### Applying Auto-Fixes
1. Retrieve unaddressed comments for the target PR.
2. For each comment with `hasSuggestion: true`:
   - Inspect the file at `filePath` around lines `[lineStart, lineEnd]`.
   - Verify that the suggested code preserves CREED OS invariants (`pnpm`, Svelte 5 runes, zero border-radius, deterministic scoring).
   - Apply the change using `replace_file_content`.
3. Run `pnpm run check` and `pnpm test` to ensure no lint, type, or test regressions.
4. Commit the fixes. Pushing a commit that touches the file automatically marks the Greptile comment as `addressed: true`.

---

## 3. Team Coding Standards (Custom Context)

Greptile's Custom Context allows defining and checking organizational standards across PR reviews.

- **List Patterns:** `list_custom_context`
- **Search Patterns:** `search_custom_context` with query term (e.g. `error handling`, `design tokens`)
- **Create Pattern:** `create_custom_context`
  - `title`: Short descriptive title
  - `body`: Guidance and examples
  - `scope`: Pattern glob (e.g. `apps/web/**`, `packages/assessment/**`)

---

## 4. Local Review CLI Commands

When developing locally or checking a branch before pushing:
- Run review: `pnpm dlx greptile review`
- Review against specific base: `pnpm dlx greptile review --branch master`
- View diff layout: `pnpm dlx greptile review --diff`
- Inspect effective config: `pnpm dlx greptile config [path]`
- Check review status for commit: `pnpm dlx greptile review status`
