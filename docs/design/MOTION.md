# WAY 2.1 Motion Contract

## 1. Lagom Motion Philosophy
Motion in CREED OS serves purely to explain state transitions, guide focus, and confirm user intent. It is never decorative or distracting.

---

## 2. Duration Contract
All UI transitions must strictly fall between **140ms and 280ms**:
- **Micro Interactions (`--duration-micro: 140ms;`):**
  - Button press, checkbox toggle, hover border color shifts, tooltip appearances.
- **Standard Transitions (`--duration-standard: 200ms;`):**
  - Tab switching, dropdown openings, progressive disclosure expansions, theme switches.
- **Emphasis Transitions (`--duration-emphasis: 280ms;`):**
  - Modal dialog entrances, drawer slide-overs, page view transitions.
- **FORBIDDEN:** Sluggish durations ($> 300ms$ such as `duration-500`, `duration-700`, `duration-1000`).

---

## 3. Easing Curve
- **`--ease-lagom`:** `cubic-bezier(0.16, 1, 0.3, 1)` (Decelerated spring-like finish, calm and precise).

---

## 4. Assessment Silence Rule
During active assessment sessions (`/student/assessment`), **all non-essential decorative animations are completely silenced**.
Assessment questions render instantly and choices respond without bounce or celebrate confetti to avoid cognitive distraction and anxiety.

---

## 5. Reduced Motion Compliance
All motion contracts respect user OS preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
