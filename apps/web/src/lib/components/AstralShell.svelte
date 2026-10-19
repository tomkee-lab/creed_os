<script lang="ts">
  import { onMount } from 'svelte';

  interface StarNode {
    // 3D base coordinates on unit sphere
    x: number;
    y: number;
    z: number;
    // Projected 3D coordinates after rotation
    rx: number;
    ry: number;
    rz: number;
    // Projected 2D screen coordinates
    sx: number;
    sy: number;
    scale: number;
    isAnchor: boolean;
    label?: string;
    twinklePhase: number;
    clusterWeight: number;
  }

  interface Edge {
    a: number;
    b: number;
    dist: number;
    isChord: boolean;
  }

  interface ShockwavePulse {
    ox: number; // 3D origin on unit sphere
    oy: number;
    oz: number;
    progress: number; // Radius of wavefront from 0 to 2.5
    speed: number;
    intensity: number;
  }

  // React Bits Pro Astral Shell Full Prop Specification
  interface Props {
    colors?: string[]; // [networkColor, highlightColor]
    backgroundColor?: string;
    nodes?: number; // 100 to 2500 (alias: nodeCount)
    nodeCount?: number;
    connections?: number; // nearest neighbours (1 to 8)
    reach?: number; // longest neighbour line relative to radius (0.2 to 0.5)
    clustering?: number; // 0 to 1
    chords?: number; // interior chords cutting through globe (0 to 1)
    radius?: number; // fraction of height (e.g. 0.44) or explicit pixel radius
    originX?: number; // 0 (left) to 1 (right)
    originY?: number; // 0 (bottom) to 1 (top)
    lineOpacity?: number; // 0 to 1
    nodeSize?: number; // 0.2 to 2.5
    depthFade?: number; // 0 to 1
    spin?: number; // speed & direction of rotation (alias: speed)
    speed?: number;
    tilt?: number; // forward tilt in degrees (default: 18)
    interactive?: boolean; // pointer effects
    draggable?: boolean; // drag to spin with momentum settling
    hoverRadius?: number; // pointer spotlight radius relative to height
    hoverBoost?: number; // brightness boost under pointer
    clickPulse?: boolean; // click shockwave pulses across globe
    pulseSpeed?: number; // speed of pulse travel
    seed?: number; // pseudo-random seed
    paused?: boolean; // pause rotation & twinkle
    dpr?: number; // upper bound for device pixel ratio
    glow?: boolean; // ambient celestial glow
    showLabels?: boolean; // display milestone labels (default: false)
    class?: string;
    className?: string;
  }

  let {
    colors,
    backgroundColor = 'transparent',
    nodes,
    nodeCount,
    connections = 4,
    reach = 0.38,
    clustering = 0.85,
    chords = 0.35,
    radius: radiusProp,
    originX = 0.5,
    originY = 0.5,
    lineOpacity = 0.7,
    nodeSize = 0.85,
    depthFade = 0.7,
    spin,
    speed: legacySpeed,
    tilt = 18,
    interactive = true,
    draggable = true,
    hoverRadius = 0.22,
    hoverBoost = 1,
    clickPulse = true,
    pulseSpeed = 1.2,
    seed = 0,
    paused = false,
    dpr: maxDpr = 2,
    glow = true,
    showLabels = false,
    class: className = '',
    className: legacyClassName = ''
  }: Props = $props();

  const finalClass = $derived(className || legacyClassName || '');
  const finalNodes = $derived(nodes ?? nodeCount ?? 180);
  const finalSpin = $derived(spin ?? legacySpeed ?? 1);

  let canvas = $state<HTMLCanvasElement | null>(null);
  let container = $state<HTMLDivElement | null>(null);

  // Core constellation milestones representing developmental learner intelligence
  const ANCHOR_MILESTONES = [
    'Adaptive CAT θ',
    'Spatial Kinematics',
    'Socratic Inquiry',
    'Evidence Provenance',
    'Cognitive Growth',
    'Curriculum Trajectory'
  ];

  $effect(() => {
    if (!canvas || !container) return;
    const rawCtx = canvas.getContext('2d', { alpha: true });
    if (!rawCtx) return;
    const ctx: CanvasRenderingContext2D = rawCtx;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let isDisposed = false;

    // Check user preference for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = motionQuery.matches;

    // 1. Generate Clustered Fibonacci Sphere Points with Deterministic Seed
    let s = (seed || 1) * 9301 + 49297;
    function pseudoRandom(): number {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    }

    const starList: StarNode[] = [];
    const N = Math.max(60, Math.min(2500, finalNodes));
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < N; i++) {
      let theta = 2 * Math.PI * i / goldenRatio;
      let phi = Math.acos(1 - (2 * (i + 0.5)) / N);

      // Apply constellation clustering displacement
      if (clustering > 0) {
        const clusterBias = Math.sin(phi * 3) * Math.cos(theta * 3) * clustering * 0.18;
        phi = Math.max(0.05, Math.min(Math.PI - 0.05, phi + clusterBias));
        theta += (pseudoRandom() - 0.5) * clustering * 0.25;
      }

      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);

      const isAnchor = i < ANCHOR_MILESTONES.length * 4 && i % 4 === 0;
      const label = isAnchor ? ANCHOR_MILESTONES[Math.floor(i / 4) % ANCHOR_MILESTONES.length] : undefined;

      starList.push({
        x,
        y,
        z,
        rx: 0,
        ry: 0,
        rz: 0,
        sx: 0,
        sy: 0,
        scale: 1,
        isAnchor,
        label,
        twinklePhase: pseudoRandom() * Math.PI * 2,
        clusterWeight: 0.8 + pseudoRandom() * 0.4
      });
    }

    // 2. Precompute Constellation Edges (Nearest-Neighbour reach + Interior chords)
    const edgeList: Edge[] = [];
    const maxReach = Math.max(0.15, Math.min(0.6, reach));
    const kConnections = Math.max(1, Math.min(8, connections));

    for (let i = 0; i < starList.length; i++) {
      // Find k-nearest neighbours on the sphere
      const candidates: { j: number; dist: number }[] = [];
      for (let j = 0; j < starList.length; j++) {
        if (i === j) continue;
        const dx = starList[i].x - starList[j].x;
        const dy = starList[i].y - starList[j].y;
        const dz = starList[i].z - starList[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist <= maxReach) {
          candidates.push({ j, dist });
        }
      }
      candidates.sort((a, b) => a.dist - b.dist);
      for (let k = 0; k < Math.min(kConnections, candidates.length); k++) {
        const { j, dist } = candidates[k];
        if (i < j) {
          edgeList.push({ a: i, b: j, dist, isChord: false });
        }
      }

      // Add long internal chords cutting through the globe
      if (chords > 0 && pseudoRandom() < (chords * 0.25)) {
        const targetIdx = Math.floor(pseudoRandom() * starList.length);
        if (targetIdx !== i) {
          const dx = starList[i].x - starList[targetIdx].x;
          const dy = starList[i].y - starList[targetIdx].y;
          const dz = starList[i].z - starList[targetIdx].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist > maxReach * 1.5) {
            edgeList.push({ a: Math.min(i, targetIdx), b: Math.max(i, targetIdx), dist, isChord: true });
          }
        }
      }
    }

    // 3. Dynamic Palette Resolution (WAY 2.1 OKLCH tokens with fallback to custom colors)
    function getPalette() {
      const isDark = document.documentElement.classList.contains('dark');
      if (colors && colors.length >= 2) {
        return {
          network: colors[0],
          highlight: colors[1],
          isDark
        };
      }
      if (isDark) {
        return {
          network: 'rgba(203, 213, 225, ', // slate-300
          highlight: 'rgba(52, 211, 153, ', // mint/emerald
          accent: 'rgba(56, 189, 248, ',   // cyan
          ambientGlow: 'rgba(16, 185, 129, 0.08)',
          isDark: true
        };
      } else {
        return {
          network: 'rgba(148, 163, 184, ',  // slate-400 (calm mineral network)
          highlight: 'rgba(5, 150, 105, ',  // deep emerald
          accent: 'rgba(2, 132, 199, ',    // deep sky
          ambientGlow: 'rgba(16, 185, 129, 0.03)',
          isDark: false
        };
      }
    }

    let palette = getPalette();

    // 4. Interactive Physics: Rotational Momentum, Dragging & Shockwave Pulses
    let rotY = 0;
    let rotX = (tilt * Math.PI) / 180;
    let velX = 0;
    let velY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let lastDragTime = 0;

    // Pointer hover coordinates for spotlight highlight
    let pointerX = -9999;
    let pointerY = -9999;
    let hasPointer = false;

    // Shockwave pulse storage
    const activePulses: ShockwavePulse[] = [];

    function triggerPulseAt(screenX: number, screenY: number) {
      if (!clickPulse) return;
      const rect = container?.getBoundingClientRect();
      if (!rect) return;
      const effectiveRadius = getEffectiveRadius(width, height);
      const cx = width * originX;
      const cy = height * originY;

      const relX = (screenX - rect.left) - cx;
      const relY = (screenY - rect.top) - cy;
      const d2 = relX * relX + relY * relY;
      const r2 = effectiveRadius * effectiveRadius;

      let ox = 0, oy = 0, oz = 1;
      if (d2 <= r2) {
        // Project click point onto front hemisphere of unit sphere
        ox = relX / effectiveRadius;
        oy = relY / effectiveRadius;
        oz = Math.sqrt(Math.max(0, 1 - ox * ox - oy * oy));
      } else {
        // Clicked outside: unproject from horizon
        const scale = 1 / Math.sqrt(d2);
        ox = relX * scale;
        oy = relY * scale;
        oz = 0;
      }

      // Unrotate pulse origin into base model coordinates
      const cosY = Math.cos(-rotY);
      const sinY = Math.sin(-rotY);
      const cosX = Math.cos(-rotX);
      const sinX = Math.sin(-rotX);

      const y1 = oy * cosX - oz * sinX;
      const z1 = oy * sinX + oz * cosX;
      const baseOx = ox * cosY + z1 * sinY;
      const baseOz = -ox * sinY + z1 * cosY;

      activePulses.push({
        ox: baseOx,
        oy: y1,
        oz: baseOz,
        progress: 0,
        speed: (pulseSpeed * 0.025),
        intensity: 1
      });

      // Limit concurrent pulses
      if (activePulses.length > 5) {
        activePulses.shift();
      }
    }

    // Pointer Event Handlers
    function handlePointerDown(e: MouseEvent) {
      if (!interactive) return;
      if (draggable) {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        lastDragTime = performance.now();
        velX = 0;
        velY = 0;
      }
      triggerPulseAt(e.clientX, e.clientY);
    }

    function handlePointerMove(e: MouseEvent) {
      if (!interactive || !container) return;
      const rect = container.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      hasPointer = (
        e.clientX >= rect.left - 80 &&
        e.clientX <= rect.right + 80 &&
        e.clientY >= rect.top - 80 &&
        e.clientY <= rect.bottom + 80
      );

      if (isDragging && draggable) {
        const now = performance.now();
        const dt = Math.max(1, now - lastDragTime);
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;

        rotY += dx * 0.005;
        rotX += dy * 0.005;

        // Keep velocity for momentum throw
        velX = (dx / dt) * 0.035;
        velY = (dy / dt) * 0.035;

        dragStartX = e.clientX;
        dragStartY = e.clientY;
        lastDragTime = now;
      }
    }

    function handlePointerUp() {
      isDragging = false;
    }

    function handlePointerLeave() {
      isDragging = false;
      hasPointer = false;
    }

    // Attach listeners
    if (interactive && container) {
      container.addEventListener('mousedown', handlePointerDown, { passive: true });
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      window.addEventListener('mouseup', handlePointerUp, { passive: true });
      window.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    }

    function getEffectiveRadius(w: number, h: number): number {
      if (radiusProp && radiusProp > 1) {
        return Math.min(radiusProp, Math.min(w, h) * 0.44);
      }
      const fraction = (radiusProp && radiusProp <= 1) ? radiusProp : 0.36;
      return Math.min(w, h) * fraction;
    }

    // 5. Canvas Resize Handler with High-DPI Calibration
    function resize() {
      if (!canvas || !container) return;
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      width = container.clientWidth;
      height = container.clientHeight;

      if (width === 0 || height === 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      palette = getPalette();
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    resize();

    // 6. Animation & Physics Simulation Loop (Steady 60 FPS)
    let lastTime = performance.now();
    const cameraDist = 1400;

    function render(currentTime: number) {
      if (isDisposed) return;

      const dt = Math.min(currentTime - lastTime, 50);
      lastTime = currentTime;

      // 6a. Spin Physics & Momentum Settling
      if (!prefersReducedMotion && !paused) {
        if (!isDragging) {
          // Apply velocity with friction decay
          rotY += velX;
          rotX += velY;
          velX *= 0.94;
          velY *= 0.94;

          // Blend gently back to base ambient spin
          const ambientVelocity = (finalSpin * 0.0015) * (dt / 16.67);
          rotY += ambientVelocity;

          // Settle rotX back towards resting tilt
          const targetTilt = (tilt * Math.PI) / 180;
          rotX += (targetTilt - rotX) * 0.03;
        }
      }

      // 6b. Advance Shockwave Pulses
      for (let p = activePulses.length - 1; p >= 0; p--) {
        const pulse = activePulses[p];
        pulse.progress += pulse.speed * (dt / 16.67);
        pulse.intensity = Math.max(0, 1 - pulse.progress / 2.2);
        if (pulse.progress > 2.2) {
          activePulses.splice(p, 1);
        }
      }

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const cx = width * originX;
      const cy = height * originY;
      const effectiveRadius = getEffectiveRadius(width, height);
      const hoverRadiusPx = hoverRadius * height;

      // Clear Canvas or fill backgroundColor
      if (backgroundColor && backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      // Optional Ambient Celestial Glow
      if (glow) {
        const glowRadius = effectiveRadius * 1.25;
        const grad = ctx.createRadialGradient(cx, cy, effectiveRadius * 0.1, cx, cy, glowRadius);
        grad.addColorStop(0, palette.ambientGlow || 'rgba(16, 185, 129, 0.05)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6c. Project Stars to 3D Coordinates
      for (let i = 0; i < starList.length; i++) {
        const sNode = starList[i];

        // Rotation around Y
        const x1 = sNode.x * cosY + sNode.z * sinY;
        const z1 = -sNode.x * sinY + sNode.z * cosY;

        // Rotation around X
        const y2 = sNode.y * cosX - z1 * sinX;
        const z2 = sNode.y * sinX + z1 * cosX;

        sNode.rx = x1 * effectiveRadius;
        sNode.ry = y2 * effectiveRadius;
        sNode.rz = z2 * effectiveRadius;

        // Perspective Camera Projection
        const pScale = cameraDist / (cameraDist - sNode.rz);
        sNode.sx = cx + sNode.rx * pScale;
        sNode.sy = cy + sNode.ry * pScale;
        sNode.scale = pScale;
      }

      // 6d. Draw Connecting Network Chords & Lines
      ctx.lineWidth = 1;

      for (let eIdx = 0; eIdx < edgeList.length; eIdx++) {
        const edge = edgeList[eIdx];
        const sA = starList[edge.a];
        const sB = starList[edge.b];

        // Depth calculation
        const avgZ = (sA.rz + sB.rz) / 2;
        const normalizedDepth = (avgZ / effectiveRadius + 1) * 0.5; // 0 (far) to 1 (near)

        // Far side depth fade
        const depthDim = 1 - depthFade * (1 - normalizedDepth);
        if (depthDim <= 0.02) continue;

        let alpha = lineOpacity * depthDim * 0.45;

        // Check if edge is stimulated by shockwave pulse
        let pulseBoost = 0;
        for (let p = 0; p < activePulses.length; p++) {
          const pulse = activePulses[p];
          // Midpoint distance to pulse origin
          const mx = (starList[edge.a].x + starList[edge.b].x) * 0.5;
          const my = (starList[edge.a].y + starList[edge.b].y) * 0.5;
          const mz = (starList[edge.a].z + starList[edge.b].z) * 0.5;
          const pDist = Math.sqrt(
            (mx - pulse.ox) ** 2 +
            (my - pulse.oy) ** 2 +
            (mz - pulse.oz) ** 2
          );
          const ringDiff = Math.abs(pDist - pulse.progress);
          if (ringDiff < 0.22) {
            pulseBoost += (1 - ringDiff / 0.22) * pulse.intensity * 0.7;
          }
        }

        alpha = Math.min(0.95, alpha + pulseBoost);

        // Check pointer hover spotlight
        let isHovered = false;
        if (hasPointer) {
          const edgeMidX = (sA.sx + sB.sx) * 0.5;
          const edgeMidY = (sA.sy + sB.sy) * 0.5;
          const dToCursor = Math.hypot(edgeMidX - pointerX, edgeMidY - pointerY);
          if (dToCursor < hoverRadiusPx) {
            isHovered = true;
            alpha = Math.min(0.95, alpha + (1 - dToCursor / hoverRadiusPx) * hoverBoost * 0.4);
          }
        }

        // Color selection
        if (pulseBoost > 0.1 || isHovered) {
          ctx.strokeStyle = `${palette.highlight}${alpha.toFixed(3)})`;
        } else if (edge.isChord) {
          ctx.strokeStyle = `${palette.network}${(alpha * 0.5).toFixed(3)})`;
        } else {
          ctx.strokeStyle = `${palette.network}${alpha.toFixed(3)})`;
        }

        ctx.beginPath();
        ctx.moveTo(sA.sx, sA.sy);
        ctx.lineTo(sB.sx, sB.sy);
        ctx.stroke();
      }

      // 6e. Draw Stars & Hubs
      for (let i = 0; i < starList.length; i++) {
        const sNode = starList[i];
        const normalizedDepth = (sNode.rz / effectiveRadius + 1) * 0.5;
        const depthDim = 1 - depthFade * (1 - normalizedDepth);
        if (depthDim <= 0.02) continue;

        // Twinkle modulation
        const twinkle = prefersReducedMotion
          ? 1
          : 0.75 + 0.25 * Math.sin(currentTime * 0.003 + sNode.twinklePhase);

        // Shockwave pulse contribution
        let starPulseBoost = 0;
        for (let p = 0; p < activePulses.length; p++) {
          const pulse = activePulses[p];
          const pDist = Math.sqrt(
            (sNode.x - pulse.ox) ** 2 +
            (sNode.y - pulse.oy) ** 2 +
            (sNode.z - pulse.oz) ** 2
          );
          const ringDiff = Math.abs(pDist - pulse.progress);
          if (ringDiff < 0.2) {
            starPulseBoost += (1 - ringDiff / 0.2) * pulse.intensity;
          }
        }

        // Hover spotlight contribution
        let starHoverBoost = 0;
        if (hasPointer) {
          const dToCursor = Math.hypot(sNode.sx - pointerX, sNode.sy - pointerY);
          if (dToCursor < hoverRadiusPx) {
            starHoverBoost = (1 - dToCursor / hoverRadiusPx) * hoverBoost;
          }
        }

        const totalBoost = Math.min(1.5, starPulseBoost + starHoverBoost);

        if (sNode.isAnchor) {
          // Developmental Anchor Milestone Hub
          const baseRadius = (2.4 * nodeSize * sNode.scale + totalBoost * 1.8);
          const alpha = Math.max(0.15, Math.min(1, (0.4 + normalizedDepth * 0.6) * depthDim + totalBoost * 0.5));

          // Outer halo
          ctx.fillStyle = `${palette.highlight}${(alpha * 0.25).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(sNode.sx, sNode.sy, baseRadius * 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Core dot
          ctx.fillStyle = `${palette.accent || palette.highlight}${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(sNode.sx, sNode.sy, baseRadius, 0, Math.PI * 2);
          ctx.fill();

          // Milestone Label
          if (showLabels && sNode.label && sNode.rz > effectiveRadius * 0.2) {
            ctx.font = '9px ui-monospace, monospace';
            ctx.fillStyle = `${palette.network}${(alpha * 0.85).toFixed(3)})`;
            ctx.fillText(sNode.label, sNode.sx + baseRadius + 4, sNode.sy + 3);
          }
        } else {
          // Regular Star Node
          const starR = Math.max(0.6, (1.6 * nodeSize * sNode.scale + totalBoost * 1.2) * sNode.clusterWeight);
          const alpha = Math.max(0.08, Math.min(1, ((0.15 + normalizedDepth * 0.7) * twinkle * depthDim) + totalBoost * 0.6));

          if (totalBoost > 0.2) {
            ctx.fillStyle = `${palette.highlight}${alpha.toFixed(3)})`;
          } else {
            ctx.fillStyle = `${palette.network}${alpha.toFixed(3)})`;
          }

          ctx.beginPath();
          ctx.arc(sNode.sx, sNode.sy, starR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    // Watch theme changes on <html> class attribute for instant palette swap
    const themeObserver = new MutationObserver(() => {
      palette = getPalette();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      isDisposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      if (interactive && container) {
        container.removeEventListener('mousedown', handlePointerDown);
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
        window.removeEventListener('mouseleave', handlePointerLeave);
      }
    };
  });
</script>

<!-- Astral Shell Container -->
<div
  bind:this={container}
  class="relative w-full h-full overflow-hidden select-none {finalClass}"
  aria-hidden="true"
>
  <canvas
    bind:this={canvas}
    class="block w-full h-full cursor-grab active:cursor-grabbing"
  ></canvas>
</div>
