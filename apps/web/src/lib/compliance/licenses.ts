/**
 * CREED OS Machine-Readable Software Bill of Materials (SBOM) & License Ledger
 * 
 * Formal compliance ledger documenting clean-room architecture,
 * copyright provenance, and complete absence of AGPL-3.0 copyleft code.
 */

export interface DependencyLicenseRecord {
  name: string;
  version: string;
  license: 'Apache-2.0' | 'MIT' | 'MPL-2.0' | 'BSD-3-Clause' | 'OFL-1.1' | 'ISC';
  spdxId: string;
  author: string;
  homepage: string;
  role: string;
  copyleftCategory: 'Permissive' | 'Weak-Copyleft' | 'Isolated-WASM';
  cleanRoomVerified: boolean;
  notes: string;
}

export const SBOM_DEPENDENCIES: DependencyLicenseRecord[] = [
  {
    name: 'blockly',
    version: '^13.3.0',
    license: 'Apache-2.0',
    spdxId: 'Apache-2.0',
    author: 'Google LLC & Raspberry Pi Foundation',
    homepage: 'https://github.com/google/blockly',
    role: 'Visual block programming framework, workspace canvas, and magnetic drag-and-drop AST serialization.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Apache-2.0 grants broad commercial reuse and express patent rights. Copyright and LICENSE notices preserved. Zero AGPL code.'
  },
  {
    name: '@blockly/field-angle',
    version: '^11.1.0',
    license: 'Apache-2.0',
    spdxId: 'Apache-2.0',
    author: 'Google LLC',
    homepage: 'https://github.com/google/blockly-plugins',
    role: 'Rotary angle selector UI widget for angular heading and robot turn blocks.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Official Google Blockly plugin under Apache-2.0.'
  },
  {
    name: '@blockly/field-slider',
    version: '^11.0.0',
    license: 'Apache-2.0',
    spdxId: 'Apache-2.0',
    author: 'Google LLC',
    homepage: 'https://github.com/google/blockly-plugins',
    role: 'Continuous numeric slider input widget for motor drive speeds.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Official Google Blockly plugin under Apache-2.0.'
  },
  {
    name: 'monaco-editor',
    version: '^0.57.0',
    license: 'MIT',
    spdxId: 'MIT',
    author: 'Microsoft Corporation',
    homepage: 'https://github.com/microsoft/monaco-editor',
    role: 'Full-featured Python code editor with syntax highlighting, soft word wrapping, and language diagnostics.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Permissive MIT license. Clean-room integration via ESM workers.'
  },
  {
    name: '@xterm/xterm',
    version: '^6.0.0',
    license: 'MIT',
    spdxId: 'MIT',
    author: 'Microsoft Corporation & xterm.js contributors',
    homepage: 'https://github.com/xtermjs/xterm.js',
    role: 'Interactive terminal emulator displaying Pyodide WebAssembly stdout, runtime telemetry, and serial logs.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Permissive MIT license. Complete decoupling from backend processes.'
  },
  {
    name: '@xterm/addon-fit',
    version: '^0.11.0',
    license: 'MIT',
    spdxId: 'MIT',
    author: 'Microsoft Corporation & xterm.js contributors',
    homepage: 'https://github.com/xtermjs/xterm.js/tree/master/addons/addon-fit',
    role: 'Dynamically fits terminal geometry to parent container, preventing row clipping or baseline slicing.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Permissive MIT license.'
  },
  {
    name: 'pyodide',
    version: 'v0.26.4',
    license: 'MPL-2.0',
    spdxId: 'MPL-2.0',
    author: 'Mozilla Foundation & Pyodide Developers',
    homepage: 'https://pyodide.org',
    role: 'CPython compiled to WebAssembly running inside an isolated Web Worker for sandboxed browser Python execution.',
    copyleftCategory: 'Isolated-WASM',
    cleanRoomVerified: true,
    notes: 'Mozilla Public License 2.0 covers Pyodide runtime files in static worker. Zero linking with application source code.'
  },
  {
    name: 'jszip',
    version: '^3.10.2',
    license: 'MIT',
    spdxId: 'MIT',
    author: 'Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso',
    homepage: 'https://stuk.github.io/jszip/',
    role: 'Reads and writes standard ZIP containers for .sb3 and native .creed project archives.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Permissive dual MIT/GPL license (MIT elected).'
  },
  {
    name: 'bits-ui',
    version: '^2.19.5',
    license: 'MIT',
    spdxId: 'MIT',
    author: 'Huntabyte & Bits UI contributors',
    homepage: 'https://bits-ui.com',
    role: 'Headless accessible UI primitives for Svelte 5 with full keyboard focus and WAI-ARIA compliance.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Permissive MIT license.'
  },
  {
    name: 'lucide-svelte / @lucide/svelte',
    version: '^0.475.0 / ^1.52.0',
    license: 'ISC',
    spdxId: 'ISC',
    author: 'Lucide Contributors',
    homepage: 'https://lucide.dev',
    role: 'Clean, angular iconography primitives matching the WAY 2.1 design system.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Permissive ISC license (functionally equivalent to MIT).'
  },
  {
    name: '@supabase/supabase-js',
    version: '^2.117.2',
    license: 'MIT',
    spdxId: 'MIT',
    author: 'Supabase Inc.',
    homepage: 'https://supabase.com',
    role: 'Client-side data connectivity and real-time syncing for project cloud ledgers.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Permissive MIT license.'
  },
  {
    name: 'dapjs',
    version: '^2.3.0',
    license: 'Apache-2.0',
    spdxId: 'Apache-2.0',
    author: 'Arm Ltd. & contributors',
    homepage: 'https://github.com/ARMmbed/dapjs',
    role: 'CMSIS-DAP WebUSB protocol implementation for direct in-browser BBC micro:bit hex flashing.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Permissive Apache-2.0 license.'
  },
  {
    name: 'esptool-js',
    version: '^0.7.0',
    license: 'Apache-2.0',
    spdxId: 'Apache-2.0',
    author: 'Espressif Systems',
    homepage: 'https://github.com/espressif/esptool-js',
    role: 'Web Serial flashing utility for ESP32 and ESP8266 microcontrollers at 115200 baud.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Official Espressif package under Apache-2.0.'
  },
  {
    name: '@fontsource-variable/jetbrains-mono',
    version: '^5.3.0',
    license: 'OFL-1.1',
    spdxId: 'OFL-1.1',
    author: 'JetBrains s.r.o.',
    homepage: 'https://www.jetbrains.com/lp/mono/',
    role: 'Technical monospace typeface for Monaco editor, xterm terminal, and psychometric readouts.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'SIL Open Font License 1.1 preserved.'
  },
  {
    name: '@fontsource-variable/inter',
    version: '^5.3.0',
    license: 'OFL-1.1',
    spdxId: 'OFL-1.1',
    author: 'Rasmus Andersson',
    homepage: 'https://rsms.me/inter/',
    role: 'High-legibility humanist UI sans-serif typeface for the WAY 2.1 design system.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'SIL Open Font License 1.1 preserved.'
  },
  {
    name: 'cesium',
    version: '^1.124.0',
    license: 'Apache-2.0',
    spdxId: 'Apache-2.0',
    author: 'Cesium GS, Inc. & Contributors',
    homepage: 'https://cesium.com/platform/cesiumjs/',
    role: '3D geospatial globe, WGS84 ellipsoid coordinates, high-precision camera kinematics, and photorealistic WebGL rendering.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Permissive Apache-2.0 license. Verified 100% commercial distribution. Configured with keyless commercial basemaps (Esri) and BYOK Google 3D Tiles.'
  },
  {
    name: 'satellite.js',
    version: '^6.0.2',
    license: 'MIT',
    spdxId: 'MIT',
    author: 'Shashwat Kandpal & satellite.js contributors',
    homepage: 'https://github.com/shashwatak/satellite-js',
    role: 'SGP4/SDP4 Keplerian orbital propagation engine computing real-time satellite geodetics and velocity vectors from CelesTrak TLE sets.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Permissive MIT license. Clean-room deterministic numerical calculations for K-12 STEM physics curriculum.'
  },
  {
    name: 'gods-eye-view',
    version: 'Clean-Room Reference',
    license: 'MIT',
    spdxId: 'MIT',
    author: 'Bilawal Sidhu',
    homepage: 'https://github.com/bilawalsidhu/gods-eye-view',
    role: 'Conceptual architectural reference for browser spatial intelligence. Non-commercial datasets (TeleGeography cables, Nepal flood pack, ALPR, OpenSky) purged and replaced with 100% commercial-grade data.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Clean-room rewrite under CREED OS WAY 2.1 design system. Upgraded to Svelte 5 runes, Bits UI, OKLCH tokens, Esri commercial imagery, and DPDP-compliant minor safety.'
  },
  {
    name: 'three',
    version: '^0.186.1',
    license: 'MIT',
    spdxId: 'MIT',
    author: 'Ricardo Cabello (mrdoob) & Three.js authors',
    homepage: 'https://threejs.org',
    role: 'Hardware-accelerated WebGL 3D scene graph, holographic orbital portal nodes, particle kinematics, and interactive camera motion.',
    copyleftCategory: 'Permissive',
    cleanRoomVerified: true,
    notes: 'Permissive MIT license. Clean-room integration for 3D holographic live application navigation and rover visualization.'
  }
];

export const CLEAN_ROOM_STATUS = {
  protocol: 'Strict Clean-Room Architecture Specification',
  auditDate: '2026-10-14',
  agplTaintViolations: 0,
  scratchCodeCopied: 0,
  proprietaryScratchAssetsUsed: 0,
  primaryBlockFoundation: 'Google Blockly (Apache-2.0)',
  pythonRuntime: 'Mozilla Pyodide WebAssembly Worker (MPL-2.0)',
  audioSynthesis: 'Native Browser Web Audio API (Clean-Room)',
  hardwareBridge: 'Browser Web Serial & WebUSB APIs (Clean-Room)',
  planetaryStudio: 'Clean-Room CesiumJS (Apache-2.0) & SGP4 (MIT) — 100% Commercial Datasets (Zero NC Assets)',
  status: '100% PRODUCTION READY & COMPLIANT'
};

export const LICENSE_TEXT_EXCERPTS = {
  'Apache-2.0': `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.`,
  'MIT': `The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.`,
  'MPL-2.0': `Mozilla Public License Version 2.0
https://www.mozilla.org/MPL/2.0/

"Covered Software" means the Source Code Form, the Executable Form, and any Larger Works created with the Covered Software. Each Contributor hereby grants You a world-wide, royalty-free, non-exclusive license to use, reproduce, make available, modify, display, perform, distribute, and otherwise exploit its Contributions.`
};
