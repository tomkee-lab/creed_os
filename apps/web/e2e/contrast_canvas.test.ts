import { test } from '@playwright/test';

test('inspect computed styles of text-muted and unselected tabs', async ({ page, context }) => {
  await context.addCookies([
    { name: 'creed_dev_session', value: 'true', url: 'http://localhost:5173' },
    { name: 'creed_dev_role', value: 'student', url: 'http://localhost:5173' },
    {
      name: 'creed_dev_user',
      value: JSON.stringify({ id: 'usr_student', name: 'Student Learner', email: 'student@core-os.app', role: 'student' }),
      url: 'http://localhost:5173'
    },
    { name: 'creed_consent_verified', value: 'true', url: 'http://localhost:5173' }
  ]);

  await page.goto('/student/report', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const styleInspection = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    function getRgb(colorStr: string): [number, number, number] {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000000';
      ctx.fillStyle = colorStr;
      ctx.fillRect(0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      return [data[0], data[1], data[2]];
    }

    function luminance(r: number, g: number, b: number): number {
      const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function contrast(c1: string, c2: string) {
      const [r1, g1, b1] = getRgb(c1);
      const [r2, g2, b2] = getRgb(c2);
      const l1 = luminance(r1, g1, b1);
      const l2 = luminance(r2, g2, b2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
    }

    // Inspect elements with .text-muted
    const mutedElements = Array.from(document.querySelectorAll('.text-muted, [class*="text-muted"]')).map(el => {
      const cs = window.getComputedStyle(el);
      const parentBg = window.getComputedStyle(el.parentElement || el).backgroundColor;
      const effectiveBg = parentBg && parentBg !== 'rgba(0, 0, 0, 0)' ? parentBg : window.getComputedStyle(document.body).backgroundColor;
      return {
        tag: el.tagName,
        text: (el.textContent || '').trim().substring(0, 30),
        className: el.className,
        computedColor: cs.color,
        rgbColor: getRgb(cs.color),
        effectiveBg,
        rgbBg: getRgb(effectiveBg),
        contrast: contrast(cs.color, effectiveBg)
      };
    });

    // Inspect domain selector buttons
    const buttons = Array.from(document.querySelectorAll('button')).map(el => {
      const cs = window.getComputedStyle(el);
      const parentBg = window.getComputedStyle(el.parentElement || el).backgroundColor;
      return {
        text: (el.textContent || '').trim(),
        className: el.className,
        computedColor: cs.color,
        rgbColor: getRgb(cs.color),
        effectiveBg: parentBg,
        rgbBg: getRgb(parentBg),
        contrast: contrast(cs.color, parentBg)
      };
    });

    return { mutedElements: mutedElements.slice(0, 10), buttons };
  });

  console.log('=== COMPUTED STYLES & CONTRAST INSPECTION (/student/report) ===');
  console.log(JSON.stringify(styleInspection, null, 2));
});
