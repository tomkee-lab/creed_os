# WAY 2.1 Surface Layering & Elevation

## 1. Calibrated Layer Hierarchy (L0–L4)
Pure stark white saturation across the entire screen causes eye fatigue and destroys visual hierarchy.
WAY 2.1 establishes a calibrated 5-tier elevation structure:

| Layer | CSS Token | Utility Class | Light Theme | Dark Theme | Typical Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **L0** | `--surface-canvas` | `.layer-l0` | Warm mineral white (`oklch 0.978`) | Deep slate (`oklch 0.145`) | Primary page background |
| **L1** | `--surface-content` | `.layer-l1` | Sunken mineral gray (`oklch 0.965`) | Soft slate well (`oklch 0.180`) | Content well, section background |
| **L2** | `--surface-raised` | `.layer-l2` / `.surface-card` | Pure white (`oklch 1.000`) | Slate raised (`oklch 0.210`) | Focus cards, tiles, primary surfaces |
| **L3** | `--surface-overlay` | `.layer-l3` | Floating neutral (`oklch 0.985`) | Elevated slate (`oklch 0.250`) | Popovers, dropdown menus |
| **L4** | `--surface-modal` | `.layer-l4` | Clear modal surface (`oklch 1.000`) | Focus modal (`oklch 0.220`) | Decision dialogs, side drawers |

---

## 2. Inset Container Token
- **`--surface-sunken` (`oklch 0.950` light / `0.120` dark):**
  Used for input wells, code readouts, and secondary contextual disclosures.

---

## 3. Shadows (Apple HIG Inspired)
- **`--shadow-subtle`:** `0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)` (Card resting state).
- **`--shadow-raised`:** `0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)` (Card hover / focus state).
- **`--shadow-overlay`:** `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)` (Modal / drawer elevation).
- **FORBIDDEN:** Heavy glow shadows, neon halos, or artificial 3D skew effects.
