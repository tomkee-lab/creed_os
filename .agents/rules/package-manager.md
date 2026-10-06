---
trigger: always_on
---

# Package Manager Enforcement Rule

- **Allowed Package Manager:** `pnpm` exclusively.
- **Forbidden:** `npm`, `npx` (use `pnpm dlx`), `yarn`.
- Under no circumstances should `npm install`, `npm run`, or `npx` be run in this workspace.
- Always use `pnpm add`, `pnpm install`, `pnpm run <script>`, `pnpm dlx <tool>`.
