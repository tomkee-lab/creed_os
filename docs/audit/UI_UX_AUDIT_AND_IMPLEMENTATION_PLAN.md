# CREED OS — UI/UX Audit and Implementation Plan

**Audit date:** 22 October 2026  
**Baseline:** `209ee0c5774c91c6a45a95199d573119466a5f5b` (main, after merged PR #5)  
**Implementation branch:** `feat/ui-ux-learning-workspace`  

---

## Product Direction

CREED OS connects assessment, practical projects, observations, and pathway exploration into a longitudinal learning record. Its useful distinction is the connection between what a learner tried, what was observed, and what to try next. A generic analytics dashboard or a page full of AI claims would obscure that distinction.

The product principles in `AGENTS.md`, `docs/PRODUCT_SPEC.md`, and `docs/design/WAY_2.1.md` establish the direction: evidence before inference, growth before labeling, deterministic scoring, human decisions, and relationship-scoped learner access. The interface should therefore make four questions easy to answer:
1. What can I do next?
2. Why is that action useful?
3. What work or observation supports the explanation?
4. What is still uncertain or awaiting permission?

---

## Findings and Changes

| Priority | Surface | Baseline Problem and Consequence | Change Implemented | Remaining Dependency |
| :--- | :--- | :--- | :--- | :--- |
| **P1** | **Landing** | Technical machinery and psychometric vocabulary appeared before the visitor understood the learning benefit. | Benefit-led hero; four-step learning loop; family, educator, and learner entry points. | Test comprehension with the intended audiences. |
| **P1** | **Public trust** | Testimonials, cryptographic language, and compliance-style statements exceeded the evidence available in the application. | Removed unsupported claims from rebuilt public/auth surfaces; explained AI and child onboarding in disclosures. | Approved privacy/terms content and verified institutional proof before adding endorsements. |
| **P1** | **Sign-in** | Prefilled credentials and development persona behavior blurred real authentication and demonstration access. | Empty credentials, normal auth request, separate explicitly development-only previews, safe return destination. | Test real accounts and email delivery in a configured staging environment. |
| **P1** | **Recovery** | Failure could appear successful; a complete reset destination was missing. | Request errors remain actionable; added token-based confirmation route and missing-link recovery state. | Production reset-email provider and end-to-end delivery verification. |
| **P1** | **Student** | Fixed recommendations and broad capability statements could look like actual learner conclusions. | General practice sequence explicitly identified; consent-aware practice action; catalog missions and evidence records. | A reviewed, evidence-linked recommendation policy with uncertainty. |
| **P1** | **Family** | Fixed trajectories and high-level claims hid the underlying work and current permission state. | Evidence-first overview, record-derived counts, guardian consent state, conversation guide, linked-learner empty state. | Multi-child selection and real relationship management. |
| **P1** | **Working actions** | Several buttons implied assignment, sending, scheduling, or publication without completing those operations. | Activity previews say no assignment was sent; notice previews say no message was sent; real CSV/QTI/calendar downloads; draft validation is local only. | Durable workflow APIs, delivery providers, approval and retry states. |
| **P1** | **Overlays** | Manual drawers/menus did not consistently trap or restore focus. Search offered ambiguous destinations and development privilege changes. | Bits UI dialogs/sheets, Escape and focus behavior; role-scoped page search with empty results and keyboard selection. | Dedicated screen-reader testing across browsers. |
| **P2** | **Navigation** | Technical role labels, ghost account actions, and inconsistent desktop/mobile controls increased orientation cost. | Task-oriented sidebar, current-page semantics, working settings/help/sign-out, mobile drawer and bottom navigation. | Review navigation after deeper workflows are connected. |
| **P2** | **Visual system** | Multiple light/dark token definitions produced conflicting accents and surface hierarchy. Auth styling diverged from the product. | Shared WAY warm mineral/teal palette and aliases; consistent theme control, fonts, form controls, action styles, and focus treatment. | Consolidate legacy token sources in a separate migration rather than maintain permanent overrides. |
| **P2** | **Staff dashboards** | Fixed totals and numerical labels looked authoritative even when unrelated to the displayed records. | Header counts derive from current collections; preview banner; sample activity labels; raw counselor psychometric copy removed. | Replace all seeded roster, caseload, dialogue, and consent data with permission-scoped records. |
| **P2** | **Small screens** | Dense studio columns and small authentication controls made mobile use harder. | Reflowing studio layout, 48px auth controls, 44px shared control defaults, accessible mobile navigation. | Assess the full authoring and assessment workflows on physical devices. |
| **P2** | **Empty/error states** | A new learner could receive an overly complete dashboard; failures could erase context or suggest success. | Evidence empty states, missing consent/learner guidance, honest auth and observation errors, preserved observation draft. | Server-side recovery, durable drafts, offline and conflict handling. |

---

## Design System & Implementation Decisions

The visual direction is **Quiet Editorial Intelligence**, derived from the repository's WAY 2.1 policy:
- **Warm mineral canvas, deep ink, teal action:** Establish continuity from public pages into the workspace and make the next action easy to locate. Semantic OKLCH variables support both themes.
- **Restrained iris for AI:** Preserve the project's AI distinction without decorative glow.
- **Inter body, DM Sans headings:** Clear typographical hierarchy with authored headlines and plain supporting text.
- **0/4/8px radii and established spacing:** Structural tables remain 0px; controls use 4px; expressive media uses 8px. No pill buttons or decorative card grid.
- **Motion as feedback:** Short transitions (140ms–280ms) and reduced-motion support; no decorative scrolling or assessment distraction.
