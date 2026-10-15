# CREED OS Open Source License Compliance & Clean-Room Architecture Dossier

**Document Classification:** Legal & Technical Compliance Ledger  
**Version:** 2.1.0-PRODUCTION  
**Audit Date:** 10 October 2026  
**Applicable Scope:** `apps/web`, `@core-os/*`, K-12 Robotics IDE, Assessment Engine, Socratic Mentor, and Pathway Navigation.

---

## 1. Executive Summary & Clean-Room Declaration

CREED OS is an AI-native learner intelligence, robotics assessment, and pathway navigation platform. In constructing the visual block programming environment, CREED OS adopted an uncompromising **Clean-Room Engineering Protocol** adhering to the following core tenets:

1. **Zero AGPL-3.0 Contamination:**  
   The main Scratch editor family (`scratch-editor`, `scratch-gui`, `scratch-vm`, `scratch-audio`, `scratch-l10n`, `scratch-desktop`) is licensed strictly under **GNU Affero General Public License v3.0 (AGPL-3.0-only)**. AGPL-3.0 imposes a viral network-copyleft obligation under Section 13, requiring any operator offering a modified version across a computer network to make the complete corresponding source code available.  
   **Affirmative Verification:** CREED OS contains **0 lines of code**, **0 modules**, and **0 direct or transitive dependencies** sourced from `scratch-editor`, `scratch-gui`, `scratch-vm`, `scratch-audio`, `scratch-l10n`, or `scratch-desktop`.

2. **Permissive Apache-2.0 Foundation:**  
   CREED OS builds upon the official **Google / Raspberry Pi Foundation Blockly** framework (`blockly ^13.3.0`), which is licensed under the **Apache License, Version 2.0**. Apache-2.0 grants broad commercial rights, modification permissions, and an express patent grant without imposing viral copyleft restrictions on neighboring or proprietary application layers.

3. **Complete Trademark & Media Asset Demarcation:**  
   All Scratch characters (e.g., *Scratch Cat*, *Gobo*, *Pico*, *Tera*), sample project graphics, official audio sound libraries, and trademarks are owned exclusively by the Massachusetts Institute of Technology (MIT) and the Scratch Foundation.  
   **Affirmative Verification:** CREED OS uses **100% original SVG geometry** (autonomous kinematics rover, ultrasonic sensor waves, geometric obstacles), original synthetic audio generators via the browser Web Audio API, and semantic design tokens conforming to the WAY 2.1 design system.

---

## 2. License Taxonomy & Ecosystem Boundary Matrix

| Component / Subsystem | Upstream Reference License | CREED OS Implementation | CREED OS License Boundary | Copyleft Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Block Workspace & Graph** | Scratch Blocks / Blockly (`Apache-2.0`) | Google Blockly (`^13.3.0`) + custom typed definitions | `Apache-2.0` (Permissive) | **None** (Notices preserved) |
| **Execution Engine / VM** | `scratch-vm` (`AGPL-3.0-only`) | Clean-Room Pyodide WebAssembly Worker + Kinematic Timeline | Proprietary (`@core-os/domain`) | **Zero** (100% Clean-Room) |
| **Code Editor** | N/A (Text editor absent in Scratch) | Microsoft Monaco Editor (`^0.57.0`) | `MIT` (Permissive) | **None** |
| **Terminal Emulator** | N/A | `@xterm/xterm` (`^6.0.0`) + `@xterm/addon-fit` | `MIT` (Permissive) | **None** |
| **Audio Playback Engine** | `scratch-audio` (`AGPL-3.0-only`) | Clean-Room `WebAudioSynthesizer` (Native `AudioContext`) | Proprietary / Clean-Room | **Zero** (Independent API) |
| **Hardware Streaming** | `scratch-link` (Local Daemon, AGPL) | Clean-Room `HardwareTelemetryBridge` (Web Serial + WebUSB) | Proprietary / Web Standards | **Zero** (No daemon required) |
| **Project File Importer** | `scratch-parser` (`AGPL-3.0-only`) | Clean-Room `scratchImporter.ts` (JSZip AST converter) | Clean-Room Interoperability | **Zero** (Reverse-engineered spec) |
| **Sprite / Costume Artwork** | Scratch Media Library (Proprietary / MIT) | 100% Original SVG Angular Kinematic Rover & Waypoints | Proprietary (`@core-os/ui`) | **Zero** (No external art) |
| **Typography & Fonts** | `scratch-render-fonts` (`Apache-2.0` + `OFL 1.1`) | Google Fonts (`Inter`, `JetBrains Mono Variable`) | `OFL 1.1` / Open Font License | **None** (OFL preserved) |

---

## 3. Clean-Room Architectural Seam Map

The following architectural model contrasts the upstream Scratch monorepo with the independently authored CREED OS production pipeline:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        UPSTREAM SCRATCH ARCHITECTURE                    │
│                                                                        │
│   scratch-gui (AGPL) ───► scratch-vm (AGPL) ───► scratch-render (WebGL) │
│           │                      │                         │           │
│           ▼                      ▼                         ▼           │
│   scratch-blocks (Apache)  scratch-audio (AGPL)     scratch-storage     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REPLACED BY CLEAN-ROOM SPECIFICATION
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CREED OS CLEAN-ROOM IMPLEMENTATION                    │
│                                                                        │
│   BrowserIDE.svelte (Svelte 5)                                         │
│   ├── blockly (^13.3.0 - Apache-2.0) ── [Visual Blocks Workspace]      │
│   ├── roboticsBlocks.ts ─────────────── [Dual Python & JS AST Gen]     │
│   ├── pyodide.worker.js (MPL-2.0) ───── [Isolated WASM Python Runtime] │
│   ├── monaco-editor (MIT) ───────────── [Full Language Service]        │
│   ├── @xterm/xterm (MIT) ────────────── [WASM stdout Execution Shell]  │
│   ├── webAudioSynth.ts ──────────────── [Native AudioContext Synthesizer]
│   └── hardwareTelemetryBridge.ts ────── [Web Serial / WebUSB 20Hz Bridge]
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Complete Software Bill of Materials (SBOM)

All production dependencies utilized in `apps/web` have been audited for licensing classification:

### Permissive Libraries (MIT License)
- **`@xterm/xterm` (v6.0.0):** Terminal emulator for WebAssembly execution stdout.
- **`@xterm/addon-fit` (v0.11.0):** Responsive viewport sizing addon for terminal geometry.
- **`monaco-editor` (v0.57.0):** Professional code editor powering the Secondary stage.
- **`three` (v0.186.1):** Hardware-accelerated WebGL 3D scene graph, holographic orbital portal nodes, particle kinematics.
- **`satellite.js` (v6.0.2):** Deterministic SGP4/SDP4 Keplerian orbital propagation engine.
- **`lucide-svelte` / `@lucide/svelte` (v0.475.0 / v1.52.0):** Angular icon primitives.
- **`bits-ui` (v2.19.5):** Headless accessible UI primitives for Svelte 5.
- **`clsx` & `tailwind-merge`:** CSS utility composition helpers.
- **`jszip` (v3.10.2):** Standard zip archive decompressor for project files.
- **`d3-scale` & `d3-shape`:** SVG coordinate scaling and mathematical geometry calculation.
- **`layerchart` (v2.5.2):** Accessible visualization components for Svelte.

### Permissive Libraries (Apache License 2.0)
- **`cesium` (v1.146.0):** 3D geospatial globe, WGS84 ellipsoid coordinates, high-precision camera kinematics, and photorealistic WebGL rendering.
- **`blockly` (v13.3.0):** Core visual block graph, magnetic drag-and-drop workspace, and block event serialization.
- **`@blockly/field-angle`:** Rotary angle selector input widget for turn blocks.
- **`@blockly/field-slider`:** Numeric range input widget for motor speeds.
- **`dapjs` (v2.3.0):** CMSIS-DAP WebUSB protocol for in-browser BBC micro:bit hex flashing.
- **`esptool-js` (v0.7.0):** Web Serial flashing utility for ESP32/ESP8266 microcontrollers.
- **`@supabase/supabase-js` (v2.117.2):** PostgreSQL client library with Row Level Security.

### Permissive Libraries (Mozilla Public License 2.0)
- **`pyodide` (WebAssembly Runtime):** CPython interpreter compiled to WebAssembly for client-side sandboxed execution.

### Permissive Fonts (SIL Open Font License 1.1)
- **`@fontsource-variable/jetbrains-mono`:** Monospace typography used across editors and data tables.
- **`@fontsource-variable/inter`:** Primary user interface typography.

---

## 5. Security & Isolation Controls (Section 9 Compliance)

In accordance with Section 9 (*Security, Privacy, and Safety Controls*) of the technical dossier:

1. **Anti-Zip-Bomb & Archive Path Traversal Defense:**  
   `scratchImporter.ts` inspects incoming `.sb3` or `.creed` archives prior to decompression. It enforces:
   - File count cap: **Maximum 100 entries**.
   - Cumulative uncompressed size ceiling: **Maximum 25 MB**.
   - Path normalization: Rejection of any file containing `../` or absolute directory prefixes.

2. **WebAssembly Execution Throttling:**  
   Pyodide execution runs inside an isolated `Worker` with an asynchronous watchdog timer. Scripts cannot block the browser DOM thread or access local storage / session cookies.

3. **Zero Native Daemons Required:**  
   Unlike `scratch-link` which requires a local background executable running on localhost with elevated privileges, CREED OS communicates directly with hardware using browser-native, permission-gated Web Serial and WebUSB APIs.

---

## 6. Verification & Release Acceptance Criteria

- [x] **Zero AGPL Code:** Complete absence of `scratch-vm`, `scratch-gui`, `scratch-audio`, `scratch-render`, and `scratch-www`.
- [x] **License Notice Display:** An interactive **Open Source Notices & License Audit** viewer is integrated into the user interface.
- [x] **Brand Autonomy:** All logos, characters, and trademarks belong exclusively to CREED OS.
- [x] **Deterministic Psychometrics:** Ability estimates ($\theta$) are calculated deterministically via 3PL IRT, never by stochastic LLMs.
- [x] **Continuous Verification:** Automated CI test suite verifies 0px layout overflow and clean-room archive importing.
