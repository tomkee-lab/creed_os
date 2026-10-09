<script lang="ts">
  let {
    glyphs = 'θλΔΣ01·•+*/\\<>=≈≠',
    cellSize = 16,
    mutationRate = 0.04,
    interval = 90,
    fadeBottom = 0.65,
    opacity = 0.50,
    color: customColor,
    class: className = ''
  }: {
    glyphs?: string;
    cellSize?: number;
    mutationRate?: number;
    interval?: number;
    fadeBottom?: number;
    opacity?: number;
    color?: string;
    class?: string;
  } = $props();

  let canvas = $state<HTMLCanvasElement | null>(null);

  $effect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let cells: string[] = [];
    let alphas: number[] = [];
    let raf = 0;
    let last = 0;
    let stopped = false;

    // Check user preference for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    function resolveColor(cssColor?: string) {
      if (cssColor) {
        const probe = document.createElement('canvas');
        probe.width = 1;
        probe.height = 1;
        const pCtx = probe.getContext('2d');
        if (pCtx) {
          pCtx.fillStyle = cssColor;
          pCtx.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = pCtx.getImageData(0, 0, 1, 1).data;
          return { r, g, b, a: a / 255 };
        }
      }

      const isDark = document.documentElement.classList.contains('dark');
      // High-contrast, beautifully balanced glyph palette:
      // Dark mode: slate-100 crisp chalk (241, 245, 249)
      // Light mode: slate-800 deep mineral ink (30, 41, 59)
      return isDark
        ? { r: 241, g: 245, b: 249, a: 1 }
        : { r: 30, g: 41, b: 59, a: 1 };
    }

    let color = resolveColor(customColor);

    const resize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (w === 0 || h === 0) return;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / cellSize);
      rows = Math.ceil(h / cellSize);

      cells = Array.from({ length: cols * rows }, () => glyphs[Math.floor(Math.random() * glyphs.length)]);
      alphas = Array.from({ length: cols * rows }, () => 0.10 + Math.random() * 0.35);
    };

    const draw = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${cellSize - 3}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = 'top';

      const colorAlpha = color.a ?? 1;

      for (let y = 0; y < rows; y++) {
        const fade = fadeBottom > 0 ? Math.max(0.12, 1 - (y / rows) * fadeBottom) : 1;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const a = alphas[i] * fade * opacity * colorAlpha;
          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${a.toFixed(3)})`;
          ctx.fillText(cells[i], x * cellSize, y * cellSize);
        }
      }
    };

    const tick = (t: number) => {
      if (stopped) return;

      if (!prefersReducedMotion && t - last >= interval) {
        last = t;
        const total = cols * rows;
        if (total > 0) {
          const mutations = Math.max(1, Math.floor(total * mutationRate));

          for (let n = 0; n < mutations; n++) {
            const i = Math.floor(Math.random() * total);
            cells[i] = glyphs[Math.floor(Math.random() * glyphs.length)];
            alphas[i] = 0.10 + Math.random() * 0.35;
          }

          draw();
        }
      }

      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    draw();

    if (!prefersReducedMotion) {
      raf = requestAnimationFrame(tick);
    }

    // Observe element resize
    const ro = new ResizeObserver(() => {
      color = resolveColor(customColor);
      resize();
      draw();
    });
    ro.observe(canvas);

    // Observe window resize as fallback
    const onWinResize = () => {
      color = resolveColor(customColor);
      resize();
      draw();
    };
    window.addEventListener('resize', onWinResize);

    // Observe theme toggle on html class attribute
    const mo = new MutationObserver(() => {
      color = resolveColor(customColor);
      draw();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Listen for reduced motion preference changes
    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(tick);
      }
    };
    motionQuery.addEventListener('change', onMotionChange);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', onWinResize);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="pointer-events-none absolute inset-0 h-full w-full select-none {className}"
  style="width: 100%; height: 100%; display: block;"
  aria-hidden="true"
></canvas>
