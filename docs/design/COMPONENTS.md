# WAY 2.1 Component Architecture

## 1. Component Registry Overview
WAY 2.1 organizes its UI library into three distinct tiers:

```
packages/ui/ & apps/web/src/lib/components/
├── Foundations (Tokens, radii, spacing, colors)
├── Primitives (Buttons, inputs, tabs, badges)
└── Proprietary Patterns (WaySection, DecisionSurface, EditorialFeature, EvidenceDisclosure, AIExplainability)
```

---

## 2. Core Primitives Specification
- **`Button`:** Full 6-state coverage (`default`, `hover`, `active`, `focus-visible`, `disabled`, `loading`). 4px radius, minimum touch target 44px on mobile, zero uppercase yelling.
- **`Input`:** 4px radius, `--surface-sunken` well with `--border-subtle`, accessible focus ring using `--border-focus`.
- **`Badge`:** Micro status indicator (`rounded-sm`, 4px padding), semantic variant (`growth`, `alert`, `primary`, `neutral`). Never use badges decoratively without semantic payload.
- **`Tabs`:** Segmented pill controls (`rounded-sm`), active high-contrast background with subtle transition.

---

## 3. The Anti-Card Rule
A `<Card>` is strictly an implementation container for genuinely independent objects.
It must never determine page information architecture or produce nested "card soup."
Pages are composed using `<WaySection>` landmarks with contextual content objects (`DecisionSurface`, `EditorialFeature`, rows, tables).
