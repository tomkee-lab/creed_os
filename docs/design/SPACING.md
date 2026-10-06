# WAY 2.1 Spacing System

## 1. True 8pt Grid Rhythm
The spacing system is rooted in an 8pt structural rhythm with a 4px micro-subdivision.

### Micro Spacing
- **`4px` (`p-1`, `gap-1`, `--space-1`):** Micro tags, badges, tight radio alignments, inline indicator gaps.

### Core Spacing
- **`8px` (`p-2`, `gap-2`, `--space-2`):** Base structural unit, compact button padding, item gaps.
- **`16px` (`p-4`, `gap-4`, `--space-4`):** Standard container padding, form row spacing.
- **`24px` (`p-6`, `gap-6`, `--space-6`):** Card inner section padding, component separation.
- **`32px` (`p-8`, `gap-8`, `--space-8`):** Major block separation within sections.

### Section & Landmark Rhythm
- **`40px` (`p-10`, `gap-10`, `--space-10`):** Layout gutters.
- **`48px` (`p-12`, `space-y-12`, `--space-12`):** Major page section transitions (`WaySection` gaps).
- **`64px` (`p-16`, `--space-16`):** Hero section separations.
- **`80px` (`p-20`, `--space-20`):** Deep editorial landmark padding.
- **`96px` (`p-24`, `--space-24`):** Marketing page break boundaries.

---

## 2. Forbidden Arbitrary Spacing
Arbitrary pixel values break structural harmony and are rejected by `pnpm run design:audit`:
- **FORBIDDEN:** `p-2.5` (10px), `px-2.5`, `p-[13px]`, `p-[17px]`, `gap-[19px]`, `m-3.5` (14px).
- **RULE:** 8px controls macro layout; 4px exists solely for micro alignment.
