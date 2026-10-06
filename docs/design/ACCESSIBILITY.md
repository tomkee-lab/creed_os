# WAY 2.1 Accessibility Governance

## 1. Compliance Standard
All CREED OS interfaces target strict compliance with **WCAG 2.2 Level AA**.

---

## 2. Mandatory Interaction State Coverage
Every interactive component (buttons, inputs, tabs, row items) must explicitly implement full 6-state coverage:
1. **Default:** Accessible contrast ratio ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large text/icons).
2. **Hover:** Clear visual shift (`var(--border-strong)` or background tint).
3. **Active:** Pressed state feedback.
4. **Focus-Visible:** Accessible 2px outline using `--border-focus` with 2px offset.
5. **Disabled:** Visual muted styling with `pointer-events-none` and `aria-disabled="true"`.
6. **Loading:** Spinner or indicator preserving layout geometry.

---

## 3. Cognitive & Child Accessibility
- **No Reliance on Color Alone:** State changes pair colors with descriptive badges, icons, or text descriptors.
- **Calm Pacing:** No countdown clocks or sudden flashing elements that induce anxiety during diagnostic inquiry.
- **Screen Reader Support:** Semantic HTML landmarks (`<main>`, `<header>`, `<nav>`, `<section>`, `<aside>`) and explicit ARIA labels for modal controls.
