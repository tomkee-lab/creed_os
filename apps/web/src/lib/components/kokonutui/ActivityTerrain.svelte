<script lang="ts">
  import { onMount } from 'svelte';
  import { cn } from '$lib/utils';

  const DAYS = 7;
  const GAP = 0.18;
  const MAX_HEIGHT = 4.2;
  const DEG = Math.PI / 180;
  const PITCH_TERRAIN = 56 * DEG;
  const YAW_TERRAIN = 18 * DEG;
  const YAW_LIMIT = 38 * DEG;
  const PITCH_LIMIT = 66 * DEG;
  const DRAG_YAW = 0.32 * DEG;
  const DRAG_PITCH = 0.36 * DEG;
  const SPIN_HALF_LIFE = 0.16;
  const SPIN_IN = (YAW_TERRAIN * Math.LN2) / SPIN_HALF_LIFE;
  const PITCH_STIFFNESS = 140;
  const PITCH_DAMPING = 2 * Math.sqrt(PITCH_STIFFNESS);
  const EDGE_STIFFNESS = 180;
  const BUMP_STIFFNESS = 400;
  const BUMP_DAMPING = 2 * Math.sqrt(BUMP_STIFFNESS) * 0.7;
  const BUMP = 0.45;
  const WAVE = 0.7;
  const PADDING = 28;
  const REST_EPSILON = 0.0005;
  const LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

  export interface ActivityTerrainProps {
    data?: number[];
    endDate?: string;
    title?: string;
    defaultFlat?: boolean;
    class?: string;
  }

  interface Cell {
    index: number;
    col: number;
    row: number;
    count: number;
    level: number;
    height: number;
    date: Date;
  }

  interface Pose {
    yaw: number;
    pitch: number;
    scale: number;
    cx: number;
    cy: number;
  }

  type Rgb = [number, number, number];

  interface Palette {
    levels: Rgb[];
    accent: Rgb;
    text: string;
    font: string;
  }

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  function easeOutBack(t: number) {
    const c = 1.4;
    const u = t - 1;
    return 1 + (c + 1) * u * u * u + c * u * u;
  }

  function rubber(value: number, min: number, max: number) {
    if (value < min) {
      return min - 0.18 * (1 - Math.exp((value - min) / 0.18));
    }
    if (value > max) {
      return max + 0.18 * (1 - Math.exp((max - value) / 0.18));
    }
    return value;
  }

  function demoData(weeks: number) {
    let seed = 7;
    const random = () => {
      seed = (seed * 16_807) % 2_147_483_647;
      return seed / 2_147_483_647;
    };
    const out: number[] = [];
    for (let i = 0; i < weeks * DAYS; i++) {
      const weekend = i % DAYS >= 5;
      const season = 0.55 + 0.45 * Math.sin(i / 23);
      const streak = random() > 0.82 ? 2.2 : 1;
      const quiet = random() < (weekend ? 0.55 : 0.12);
      out.push(quiet ? 0 : Math.round((weekend ? 3 : 9) * season * streak * random()));
    }
    return out;
  }

  const DEFAULT_DATA = demoData(26);

  function parseDay(value: string) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  function buildCells(data: number[], endDate: string): Cell[] {
    const end = parseDay(endDate);
    const start = new Date(end.getTime() - (data.length - 1) * 86_400_000);
    const offset = (start.getUTCDay() + 6) % 7;
    const max = Math.max(1, ...data);
    return data.map((count, index): Cell => {
      const slot = index + offset;
      const norm = count / max;
      return {
        index,
        col: Math.floor(slot / DAYS),
        row: slot % DAYS,
        count,
        level: count === 0 ? 0 : Math.ceil(norm * 4),
        height: 0.06 + norm ** 0.85 * MAX_HEIGHT,
        date: new Date(start.getTime() + index * 86_400_000)
      };
    });
  }

  function parseCssColor(value: string): Rgb {
    const trimmed = value.trim();
    if (trimmed.startsWith('rgb')) {
      const m = trimmed.match(/\d+(\.\d+)?/g);
      if (m && m.length >= 3) {
        return [Math.round(Number(m[0])), Math.round(Number(m[1])), Math.round(Number(m[2]))];
      }
    }
    if (typeof document !== 'undefined') {
      const testEl = document.createElement('div');
      testEl.style.color = trimmed;
      document.body.appendChild(testEl);
      const computed = getComputedStyle(testEl).color;
      document.body.removeChild(testEl);
      const m = computed.match(/\d+(\.\d+)?/g);
      if (m && m.length >= 3) {
        return [Math.round(Number(m[0])), Math.round(Number(m[1])), Math.round(Number(m[2]))];
      }
    }
    return [120, 124, 140];
  }

  function shade([r, g, b]: Rgb, amount: number) {
    const k = 1 - amount;
    return `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)})`;
  }

  function readPalette(node: HTMLElement): Palette {
    const style = getComputedStyle(node);
    const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
    return {
      levels: [
        parseCssColor(read('--terrain-0', 'rgb(238, 240, 243)')),
        parseCssColor(read('--terrain-1', 'rgb(208, 211, 232)')),
        parseCssColor(read('--terrain-2', 'rgb(164, 166, 224)')),
        parseCssColor(read('--terrain-3', 'rgb(122, 118, 228)')),
        parseCssColor(read('--terrain-4', 'rgb(91, 80, 230)'))
      ],
      accent: parseCssColor(read('--terrain-accent', 'rgb(91, 80, 230)')),
      text: read('--terrain-text', 'rgb(115, 121, 140)'),
      font: style.fontFamily || 'sans-serif'
    };
  }

  function project(pose: Pose, x: number, y: number, z: number) {
    const cos = Math.cos(pose.yaw);
    const sin = Math.sin(pose.yaw);
    const xr = x * cos - z * sin;
    const zr = x * sin + z * cos;
    return [
      pose.cx + xr * pose.scale,
      pose.cy + (zr * Math.cos(pose.pitch) - y * Math.sin(pose.pitch)) * pose.scale
    ];
  }

  function visibleFaces(
    pose: Pose,
    x0: number,
    z0: number,
    h: number
  ): { points: number[][]; tone: number }[] {
    const x1 = x0 + 1 - GAP;
    const z1 = z0 + 1 - GAP;
    const p = (x: number, y: number, z: number) => project(pose, x, y, z);
    const faces: { points: number[][]; tone: number }[] = [];
    const sin = Math.sin(pose.yaw);
    const cos = Math.cos(pose.yaw);

    if (h > 0.02 && pose.pitch > 0.01) {
      if (cos > 0) {
        faces.push({
          points: [p(x0, 0, z1), p(x1, 0, z1), p(x1, h, z1), p(x0, h, z1)],
          tone: 0.22
        });
      } else {
        faces.push({
          points: [p(x0, 0, z0), p(x1, 0, z0), p(x1, h, z0), p(x0, h, z0)],
          tone: 0.22
        });
      }
      if (sin > 0.001) {
        faces.push({
          points: [p(x1, 0, z0), p(x1, 0, z1), p(x1, h, z1), p(x1, h, z0)],
          tone: 0.38
        });
      } else if (sin < -0.001) {
        faces.push({
          points: [p(x0, 0, z0), p(x0, 0, z1), p(x0, h, z1), p(x0, h, z0)],
          tone: 0.38
        });
      }
    }

    faces.push({
      points: [p(x0, h, z0), p(x1, h, z0), p(x1, h, z1), p(x0, h, z1)],
      tone: 0
    });
    return faces;
  }

  function inside(points: number[][], x: number, y: number) {
    let hit = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [xi, yi] = points[i];
      const [xj, yj] = points[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        hit = !hit;
      }
    }
    return hit;
  }

  function polygon(ctx: CanvasRenderingContext2D, points: number[][]) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
  }

  const formatDay = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });

  const formatMonth = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });

  let {
    data = DEFAULT_DATA,
    endDate = '2026-10-11',
    title = 'Longitudinal Practice Terrain',
    defaultFlat = false,
    class: className = ''
  }: ActivityTerrainProps = $props();

  let flat = $state(false);
  let active = $state<Cell | null>(null);
  let dragging = $state(false);

  const cells = $derived(buildCells(data, endDate));
  const weeks = $derived((cells.at(-1)?.col ?? 0) + 1);
  const total = $derived(data.reduce((sum, n) => sum + n, 0));

  let canvasEl = $state<HTMLCanvasElement | null>(null);
  let palette: Palette | null = null;

  const sim = {
    yaw: 0,
    yawSpeed: 0,
    pitch: 0,
    pitchSpeed: 0,
    pitchTarget: 0,
    bumps: new Float64Array(0),
    bumpSpeeds: new Float64Array(0),
    hovered: -1,
    origin: { col: 0, row: 3 },
    width: 0,
    height: 0,
    dpr: 1,
    drag: null as null | {
      id: number;
      x: number;
      y: number;
      yaw: number;
      pitch: number;
      moved: boolean;
      samples: { t: number; x: number; y: number }[];
    },
    raf: 0,
    last: 0,
    visible: false,
    started: false,
    reduceMotion: false
  };

  $effect(() => {
    if (sim.bumps.length !== cells.length) {
      sim.bumps = new Float64Array(cells.length);
      sim.bumpSpeeds = new Float64Array(cells.length);
    }
  });

  function columnHeight(cell: Cell, lift: number) {
    const span = Math.hypot(weeks, DAYS) || 1;
    const d = Math.hypot(cell.col - sim.origin.col, cell.row - sim.origin.row) / span;
    const local = clamp(lift * (1 + WAVE) - d * WAVE, 0, 1);
    return cell.height * easeOutBack(local) + sim.bumps[cell.index];
  }

  function getPose(): Pose & { lift: number } {
    const lift = clamp(sim.pitch / PITCH_TERRAIN, 0, 1.2);
    const w = weeks;
    const corners = [
      [0, 0],
      [w, 0],
      [0, DAYS],
      [w, DAYS]
    ];
    const probe: Pose = { yaw: sim.yaw, pitch: sim.pitch, scale: 1, cx: 0, cy: 0 };
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const [x, z] of corners) {
      for (const y of [0, MAX_HEIGHT * Math.min(lift, 1)]) {
        const [px, py] = project(probe, x - w / 2, y, z - DAYS / 2);
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);
      }
    }

    const scale = Math.min(
      (sim.width - PADDING * 2) / (maxX - minX),
      (sim.height - PADDING * 2) / (maxY - minY)
    );

    return {
      yaw: sim.yaw,
      pitch: sim.pitch,
      scale,
      cx: sim.width / 2 - ((minX + maxX) / 2) * scale,
      cy: sim.height / 2 - ((minY + maxY) / 2) * scale + 6,
      lift
    };
  }

  function getOrderedCells(p: Pose) {
    const sin = Math.sin(p.yaw);
    const cos = Math.cos(p.yaw);
    const depth = (c: Cell) => (c.col + 0.5 - weeks / 2) * sin + (c.row + 0.5 - DAYS / 2) * cos;
    return [...cells].sort((a, b) => depth(a) - depth(b));
  }

  function drawLabels(ctx: CanvasRenderingContext2D, p: Pose, lift: number, pal: Palette) {
    const alpha = clamp(1 - lift * 1.6, 0, 1);
    if (alpha === 0) return;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = pal.text;
    ctx.font = `11px ${pal.font}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';

    let month = -1;
    for (const cell of cells) {
      if (cell.row !== 0 && cell.index !== 0) continue;
      const m = cell.date.getUTCMonth();
      if (m !== month && cell.col < weeks - 1) {
        month = m;
        const [x, y] = project(p, cell.col - weeks / 2, 0, -0.75 - DAYS / 2);
        ctx.fillText(formatMonth(cell.date), x, y);
      }
    }

    ctx.textAlign = 'right';
    for (let row = 0; row < DAYS; row++) {
      if (LABELS[row]) {
        const [x, y] = project(p, -0.35 - weeks / 2, 0, row + 0.4 - DAYS / 2);
        ctx.fillText(LABELS[row], x, y);
      }
    }
    ctx.globalAlpha = 1;
  }

  function draw() {
    if (!canvasEl || !sim.width) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    palette ??= readPalette(canvasEl);
    const p = getPose();

    ctx.setTransform(sim.dpr, 0, 0, sim.dpr, 0, 0);
    ctx.clearRect(0, 0, sim.width, sim.height);
    drawLabels(ctx, p, p.lift, palette);
    ctx.lineJoin = 'miter';

    for (const cell of getOrderedCells(p)) {
      const h = columnHeight(cell, p.lift);
      const color = cell.index === sim.hovered ? palette.accent : palette.levels[cell.level];
      for (const face of visibleFaces(p, cell.col - weeks / 2, cell.row - DAYS / 2, h)) {
        polygon(ctx, face.points);
        const fill = shade(color, face.tone);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = fill;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  function hitTest(x: number, y: number) {
    const p = getPose();
    const list = getOrderedCells(p);
    for (let i = list.length - 1; i >= 0; i--) {
      const cell = list[i];
      const h = columnHeight(cell, p.lift);
      for (const face of visibleFaces(p, cell.col - weeks / 2, cell.row - DAYS / 2, h)) {
        if (inside(face.points, x, y)) {
          return cell;
        }
      }
    }
    return null;
  }

  function stepSprings(dt: number) {
    let energy = 0;
    if (!sim.drag) {
      sim.yawSpeed *= 0.5 ** (dt / SPIN_HALF_LIFE);
      let target = sim.yaw;
      if (sim.pitchTarget === 0) {
        target = 0;
      } else if (sim.yaw > YAW_LIMIT) {
        target = YAW_LIMIT;
      } else if (sim.yaw < -YAW_LIMIT) {
        target = -YAW_LIMIT;
      }

      if (target !== sim.yaw) {
        sim.yawSpeed +=
          ((target - sim.yaw) * EDGE_STIFFNESS - sim.yawSpeed * 2 * Math.sqrt(EDGE_STIFFNESS)) * dt;
      }
      sim.yaw += sim.yawSpeed * dt;
      energy = Math.max(energy, Math.abs(sim.yawSpeed), Math.abs(target - sim.yaw));

      const force = (sim.pitchTarget - sim.pitch) * PITCH_STIFFNESS - sim.pitchSpeed * PITCH_DAMPING;
      sim.pitchSpeed += force * dt;
      sim.pitch += sim.pitchSpeed * dt;
      energy = Math.max(energy, Math.abs(sim.pitchSpeed), Math.abs(sim.pitchTarget - sim.pitch));
    }

    for (let i = 0; i < sim.bumps.length; i++) {
      const target = i === sim.hovered && sim.pitch > 0.1 ? BUMP : 0;
      sim.bumpSpeeds[i] +=
        ((target - sim.bumps[i]) * BUMP_STIFFNESS - sim.bumpSpeeds[i] * BUMP_DAMPING) * dt;
      sim.bumps[i] += sim.bumpSpeeds[i] * dt;
      energy = Math.max(energy, Math.abs(sim.bumpSpeeds[i]) * 0.1, Math.abs(target - sim.bumps[i]));
    }
    return energy;
  }

  function tick(now: number) {
    sim.raf = 0;
    const dt = sim.last ? Math.min((now - sim.last) / 1000, 1 / 30) : 1 / 60;
    sim.last = now;
    const energy = stepSprings(dt);
    draw();
    if ((sim.drag || energy > REST_EPSILON) && sim.visible) {
      sim.raf = requestAnimationFrame(tick);
    } else {
      sim.last = 0;
    }
  }

  function turnIn() {
    if (Math.abs(sim.yaw) > 2 * DEG) return;
    if (sim.reduceMotion) {
      sim.yaw = YAW_TERRAIN;
    } else {
      sim.yawSpeed = SPIN_IN;
    }
  }

  function wake() {
    if (sim.reduceMotion) {
      sim.pitch = sim.pitchTarget;
      sim.yaw = clamp(sim.yaw, -YAW_LIMIT, YAW_LIMIT);
      sim.pitchSpeed = 0;
      sim.yawSpeed = 0;
      sim.bumps.fill(0);
      draw();
      return;
    }
    if (!sim.raf && sim.visible) {
      sim.raf = requestAnimationFrame(tick);
    }
  }

  function setView(nextFlat: boolean, origin?: { col: number; row: number }) {
    flat = nextFlat;
    sim.origin = origin ?? { col: nextFlat ? weeks : 0, row: 3 };
    sim.pitchTarget = nextFlat ? 0 : PITCH_TERRAIN;
    sim.yawSpeed = 0;
    if (!nextFlat) turnIn();
    wake();
  }

  function localPoint(event: PointerEvent) {
    const rect = canvasEl?.getBoundingClientRect();
    return rect ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : { x: 0, y: 0 };
  }

  function hover(cell: Cell | null) {
    const index = cell ? cell.index : -1;
    if (index !== sim.hovered) {
      sim.hovered = index;
      active = cell;
      if (sim.reduceMotion) {
        draw();
      } else {
        wake();
      }
    }
  }

  function handlePointerDown(event: PointerEvent) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (!canvasEl) return;
    const { x, y } = localPoint(event);
    canvasEl.setPointerCapture(event.pointerId);
    const cell = hitTest(x, y);
    if (cell) {
      sim.origin = { col: cell.col, row: cell.row };
    }
    sim.drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      yaw: sim.yaw,
      pitch: sim.pitch,
      moved: false,
      samples: [{ t: event.timeStamp, x: event.clientX, y: event.clientY }]
    };
    sim.yawSpeed = 0;
    sim.pitchSpeed = 0;
    dragging = true;
    hover(cell);
    wake();
  }

  function handlePointerMove(event: PointerEvent) {
    const drag = sim.drag;
    if (!drag || drag.id !== event.pointerId) {
      if (event.pointerType === 'mouse') {
        const { x, y } = localPoint(event);
        hover(hitTest(x, y));
      }
      return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 4) {
      drag.moved = true;
    }
    if (!drag.moved) return;

    sim.yaw = rubber(drag.yaw + dx * DRAG_YAW, -YAW_LIMIT, YAW_LIMIT);
    sim.pitch = rubber(drag.pitch + dy * DRAG_PITCH, 0, PITCH_LIMIT);
    drag.samples.push({
      t: event.timeStamp,
      x: event.clientX,
      y: event.clientY
    });
    if (drag.samples.length > 5) {
      drag.samples.shift();
    }
    if (sim.reduceMotion) {
      draw();
    } else {
      wake();
    }
  }

  function handlePointerUp(event: PointerEvent) {
    const drag = sim.drag;
    if (!drag || drag.id !== event.pointerId) return;
    sim.drag = null;
    dragging = false;
    if (!drag.moved) {
      wake();
      return;
    }

    const first = drag.samples[0];
    const lastSample = drag.samples.at(-1) ?? first;
    const dt = Math.max((lastSample.t - first.t) / 1000, 0.016);
    const vx = (lastSample.x - first.x) / dt;
    const vy = (lastSample.y - first.y) / dt;
    const recent = event.timeStamp - lastSample.t < 80;
    sim.yawSpeed = recent ? vx * DRAG_YAW : 0;
    sim.pitchSpeed = recent ? vy * DRAG_PITCH : 0;

    const projected = sim.pitch + sim.pitchSpeed * 0.15;
    const nextFlat = projected < PITCH_TERRAIN / 2;
    flat = nextFlat;
    sim.pitchTarget = nextFlat ? 0 : PITCH_TERRAIN;
    wake();
  }

  function handlePointerLeave(event: PointerEvent) {
    if (!sim.drag && event.pointerType === 'mouse') {
      hover(null);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1]
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();

    const current = cells[sim.hovered] ?? cells.at(-1);
    if (!current) return;
    const col = current.col + move[0];
    const row = current.row + move[1];
    const next = cells.find((c) => c.col === col && c.row === row);
    hover(next ?? current);
  }

  onMount(() => {
    flat = defaultFlat;
    sim.pitchTarget = defaultFlat ? 0 : PITCH_TERRAIN;
    if (!canvasEl) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    sim.reduceMotion = motion.matches;

    const resize = new ResizeObserver(([entry]) => {
      sim.width = entry.contentRect.width;
      sim.height = entry.contentRect.height;
      sim.dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvasEl) {
        canvasEl.width = Math.round(sim.width * sim.dpr);
        canvasEl.height = Math.round(sim.height * sim.dpr);
      }
      draw();
    });
    resize.observe(canvasEl);

    let onScreen = false;
    const update = () => {
      sim.visible = onScreen && !document.hidden;
      if (sim.visible) {
        if (!sim.started) {
          sim.started = true;
          if (sim.pitchTarget > 0) turnIn();
        }
        wake();
      } else if (sim.raf) {
        cancelAnimationFrame(sim.raf);
        sim.raf = 0;
        sim.last = 0;
      }
    };

    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    intersection.observe(canvasEl);
    document.addEventListener('visibilitychange', update);

    const repaint = () => {
      palette = null;
      draw();
    };
    const theme = new MutationObserver(repaint);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme']
    });
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', repaint);

    return () => {
      resize.disconnect();
      intersection.disconnect();
      theme.disconnect();
      scheme.removeEventListener('change', repaint);
      document.removeEventListener('visibilitychange', update);
      if (sim.raf) {
        cancelAnimationFrame(sim.raf);
        sim.raf = 0;
      }
    };
  });

  const readout = $derived(
    active
      ? `${active.count} ${active.count === 1 ? 'activity' : 'activities'} on ${formatDay(active.date)}`
      : `${total.toLocaleString('en-US')} developmental activities across ${weeks} weeks`
  );
</script>

<div
  class={cn(
    'terrain-root w-full select-none rounded-none border border-border bg-surface-raised text-ink transition-colors duration-200',
    className
  )}
>
  <div class="flex items-start justify-between gap-4 p-4 pb-0">
    <div class="min-w-0">
      <p class="font-mono font-medium text-xs uppercase tracking-wider text-ink-muted">{title}</p>
      <p aria-live="polite" class="mt-0.5 truncate font-semibold text-sm tracking-tight tabular-nums text-ink">
        {readout}
      </p>
    </div>
    <div class="flex shrink-0 rounded-sm border border-border bg-surface-subtle p-0.5 text-xs">
      {#each [['Flat', true], ['Terrain', false]] as [name, value]}
        <button
          type="button"
          aria-pressed={flat === value}
          onclick={() => flat !== value && setView(value as boolean)}
          class={cn(
            'min-h-8 rounded-xs px-3 py-1 font-medium outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors duration-150 cursor-pointer',
            flat === value
              ? 'bg-surface-raised text-ink font-semibold shadow-2xs'
              : 'text-ink-muted hover:text-ink'
          )}
        >
          {name}
        </button>
      {/each}
    </div>
  </div>

  <canvas
    bind:this={canvasEl}
    aria-label={`${title}: ${total.toLocaleString('en-US')} activities over ${weeks} weeks. Use arrow keys to navigate.`}
    tabindex="0"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerUp}
    onlostpointercapture={handlePointerUp}
    onpointerleave={handlePointerLeave}
    onkeydown={handleKeyDown}
    onblur={() => {
      if (!sim.drag) hover(null);
    }}
    class={cn(
      'block h-64 w-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-brand',
      dragging ? 'cursor-grabbing' : 'cursor-grab'
    )}
  ></canvas>

  <div class="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-ink-secondary">
    <span class="font-mono text-[11px] text-ink-muted">Drag to rotate · Click for origin wave</span>
    <div class="flex items-center gap-1">
      <span class="mr-1 text-[11px] text-ink-muted">Less</span>
      {#each [0, 1, 2, 3, 4] as level}
        <span
          class="size-2 rounded-none"
          style="background: var(--terrain-{level})"
        ></span>
      {/each}
      <span class="ml-1 text-[11px] text-ink-muted">More</span>
    </div>
  </div>
</div>

<style>
  .terrain-root {
    --terrain-0: var(--surface-subtle);
    --terrain-1: color-mix(in oklch, var(--brand) 22%, var(--surface-subtle));
    --terrain-2: color-mix(in oklch, var(--brand) 45%, var(--surface-subtle));
    --terrain-3: color-mix(in oklch, var(--brand) 72%, var(--surface-subtle));
    --terrain-4: var(--brand);
    --terrain-accent: var(--cyan);
    --terrain-text: var(--foreground-muted);
  }
</style>
