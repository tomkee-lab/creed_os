# CREED OS: AI-Native Learner Intelligence & Navigation Platform

> **Measure Deeply. Learn Personally. Explore Boldly. Decide with Evidence.**

CREED OS is a production-oriented multi-tenant educational intelligence platform. It maintains a longitudinal learner evidence model connecting adaptive diagnostic assessments (Item Response Theory), continuous competency tracking, hands-on project experiments, and transparent pathway navigation.

---

## Strict Package Management Rule

> [!IMPORTANT]
> **`pnpm` is the ONLY allowed package manager.**
> `npm` and `yarn` are strictly **FORBIDDEN** across all commands, scripts, workflows, and documentation.

```bash
# Correct
pnpm install
pnpm dev
pnpm build
pnpm test

# FORBIDDEN: npm install, npm run dev, npx ... (Use `pnpm dlx` instead)
```

---

## Architecture at a Glance

```text
Student / Parent / Teacher / School Portals
                      │
            SvelteKit 2 + Svelte 5
             WAY Design System (Bits UI)
                      │
         Effect Domain Application Layer
                      │
   ┌──────────────────┼──────────────────┐
   ▼                  ▼                  ▼
Assessment Engine   Evidence Engine    Pathway Engine
(3PL IRT & CAT)    (5-Level Graph)   (Mismatch & Sim)
   │                  │                  │
   └──────────────────┼──────────────────┘
                      ▼
         Supabase PostgreSQL 16
     (RLS, pgvector, ltree, Outbox)
```

---

## Comprehensive Documentation

Deep technical and product specifications are located in the [`docs/`](./docs) directory:

- [System Architecture Specification](./docs/ARCHITECTURE.md)
- [Product Specification & Methodology](./docs/PRODUCT_SPEC.md)
- [Psychometrics & Computerized Adaptive Testing (CAT)](./docs/PSYCHOMETRICS_CAT.md)
- [Learner Evidence Graph Specification](./docs/EVIDENCE_ENGINE.md)
- [Pathway Graph & Mismatch Engine](./docs/PATHWAY_GRAPH.md)
- [WAY Design System Specification](./docs/DESIGN_SYSTEM.md)
- [Security, Privacy & Child Safety Governance (DPDP Act)](./docs/SECURITY_GOVERNANCE.md)
- [REST API & Contract Specification](./docs/API_SPEC.md)
- [Greptile AI Code Review & Model Context Protocol (MCP) Integration](./docs/GREPTILE_INTEGRATION.md)

---

## Project Structure (Turborepo + pnpm Workspaces)

```text
core-os/
├── apps/
│   └── web/                   # SvelteKit 2 + Svelte 5 Full Platform Application
├── packages/
│   ├── domain/                # Core domain models, Zod schemas & Effect types
│   ├── assessment/            # 3PL IRT psychometrics, EAP theta, & CAT engine
│   ├── ui/                    # WAY Design System (Bits UI + OKLCH tokens)
│   └── ai/                    # Gemini API provider & Socratic dialogue engine
├── supabase/
│   ├── migrations/            # Production PostgreSQL DDL with Row Level Security
│   └── seed.sql               # STEM item banks, pathways & competency seeds
├── docs/                      # Comprehensive technical & product documentation
└── .agents/rules/             # Antigravity project enforcement rules
```

---

## Quickstart

### Prerequisites
- Node.js v20+ or v24+
- `pnpm` v9+ or v11+ (`corepack enable pnpm`)

### Installation & Execution
```bash
# 1. Install all dependencies across monorepo
pnpm install

# 2. Run unit tests (Psychometrics, IRT, CAT convergence, Domain Schemas)
pnpm test

# 3. Start development server
pnpm dev
```

Visit `http://localhost:5173` to explore the Student ("My Learning & Future Map"), Parent, and Teacher experiences.
