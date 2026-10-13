# CREED OS — Release Evidence Repository

This directory contains cryptographically verifiable, independently audited evidence artifacts supporting the **CREED OS Production-Readiness Verification Plan** ([`docs/release/PRODUCTION_READINESS_VERIFICATION_PLAN.md`](file:///c:/learning/docs/release/PRODUCTION_READINESS_VERIFICATION_PLAN.md)).

## Directory Hierarchy

When verifying a release candidate (e.g. `v1.0.0-rc1`), populate the release directory using this exact taxonomy:

```text
evidence/
└── release/
    └── <release-id>/                     # e.g., v1.0.0-rc1
        ├── build-provenance.md           # Gate 1: Git SHA, toolchain, checksums, CI URL
        ├── command-results/              # Gate 1: Terminal execution transcripts
        ├── ci/
        │   ├── required-gates.md         # Gate 7: CI workflow validation
        │   └── repeated-runs-summary.md  # Gate 7: Multi-run E2E stability log
        ├── security/
        │   ├── auth-matrix.csv           # Gate 2: Endpoint authorization audit
        │   ├── consent-lifecycle.md      # Gate 2: DPDP consent state machine tests
        │   ├── production-negative-tests.md # Gate 2: Adversarial bypass tests
        │   ├── rls-test-results.md       # Gate 3: Database tenant isolation tests
        │   └── policy-inventory.sql      # Gate 3: Catalog of active Supabase policies
        ├── psychometrics/
        │   └── data-exposure-matrix.md   # Gate 4: Parameter leak audit & AST scans
        ├── accessibility/
        │   ├── accessibility-results.md  # Gate 5: axe-core audit & WCAG AA manual log
        │   └── keyboard-defect-log.md    # Gate 5: Focus & tab order verification
        ├── visual-regression/
        │   └── viewports/                # Gate 5: Responsive screenshots (375px, 768px, 1280px)
        ├── supply-chain/
        │   ├── sbom.cdx.json             # Gate 6: CycloneDX SBOM
        │   ├── vulnerability-scan.json   # Gate 6: pnpm audit output
        │   └── license-review.md         # Gate 6: Open source license evaluation
        ├── operations/
        │   ├── operational-readiness.md  # Gate 9: Migrations, backups, monitoring
        │   ├── sandbox-isolation.md      # Gate 9: Pyodide worker security audit
        │   └── disaster-recovery.log     # Gate 9: Backup restore verification
        ├── risks/
        │   └── risk-register.csv         # Gate 8: Master finding & risk ledger
        └── release-decision.md           # Gate 8: Final sign-off document
```

## Evidence Ingestion Rules

1. **Zero Secret Leaks:** Do **NOT** commit live API secrets, database credentials, production private keys, or non-synthetic user records into evidence files.
2. **Deterministic Logs:** Every test result must include exact commit SHA, timestamp, exit code, and reproducer command.
3. **Four Decision States:** Only mark files as verified with `PASS — Verified`, `PENDING — Not yet verified`, `FAIL — Release blocked`, or `ACCEPTED RISK — Explicit approval required`.
4. **Evidence Freshness:** Any subsequent commit touching a gate's code invalidates prior passes; evidence must correspond to the exact release candidate commit.
