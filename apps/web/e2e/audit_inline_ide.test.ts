import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'node:fs';

test('inspect inline IDE layout, toolbar, dropdowns, and arena dimensions', async ({ page, context }) => {
  test.setTimeout(90000);
  const outDir = process.env.TEST_OUTPUT_DIR || path.join(process.cwd(), 'test-results', 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

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

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/sandbox', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Switch to Robotics IDE section in sandbox
  const ideTab = page.locator('button:has-text("1. Robotics")').filter({ visible: true }).first();
  await ideTab.click();
  await page.waitForTimeout(800);

  // Scroll IDE into center view
  const ideLocator = page.locator('div.flex.flex-col.w-full.border.border-border');
  await ideLocator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // 1. Screenshot of default enhanced inline workbench
  await page.screenshot({ path: path.join(outDir, 'audit_inline_workbench_after.png') });

  // 2. Measure IDE metrics
  const metrics = await page.evaluate(() => {
    const ide = document.querySelector('div.flex.flex-col.w-full.border.border-border');
    const tier1 = ide?.querySelectorAll('div.h-10')[0];
    const tier2 = ide?.querySelectorAll('div.h-8')[0];
    const arenaSvg = ide?.querySelector('svg[viewBox="0 0 300 300"]');
    const arenaContainer = arenaSvg?.parentElement;
    const telemetryBar = ide?.querySelector('div.px-3.py-2.border-t.border-border');

    const ideRect = ide?.getBoundingClientRect();
    const tier1Rect = tier1?.getBoundingClientRect();
    const tier2Rect = tier2?.getBoundingClientRect();
    const arenaSvgRect = arenaSvg?.getBoundingClientRect();
    const arenaContainerRect = arenaContainer?.getBoundingClientRect();
    const telemetryRect = telemetryBar?.getBoundingClientRect();

    return {
      ide: ideRect ? { w: ideRect.width, h: ideRect.height } : null,
      tier1: tier1Rect ? { w: tier1Rect.width, scrollW: tier1?.scrollWidth, h: tier1Rect.height } : null,
      tier2: tier2Rect ? { w: tier2Rect.width, scrollW: tier2?.scrollWidth, h: tier2Rect.height } : null,
      arenaSvg: arenaSvgRect ? { w: arenaSvgRect.width, h: arenaSvgRect.height } : null,
      arenaContainer: arenaContainerRect ? { w: arenaContainerRect.width, h: arenaContainerRect.height } : null,
      telemetry: telemetryRect ? { w: telemetryRect.width, h: telemetryRect.height, top: telemetryRect.top, bottom: telemetryRect.bottom } : null
    };
  });

  console.log('--- ENHANCED METRICS ---', JSON.stringify(metrics, null, 2));

  // Assertions: Zero horizontal scroll overflow in toolbars!
  if (metrics.tier1) {
    expect(metrics.tier1.scrollW).toBeLessThanOrEqual(metrics.tier1.w);
  }
  if (metrics.tier2) {
    expect(metrics.tier2.scrollW).toBeLessThanOrEqual(metrics.tier2.w);
  }

  // 3. Open Mission Dropdown and capture screenshot
  const missionBtn = page.getByRole('button', { name: 'Select Robotics Mission' });
  await missionBtn.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'audit_mission_dropdown.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);

  // 4. Open Project Dropdown and capture screenshot
  const projectBtn = page.getByRole('button', { name: 'Project Actions' });
  await projectBtn.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'audit_project_dropdown.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);

  // 5. Open Hardware Dropdown and capture screenshot
  const hardwareBtn = page.getByRole('button', { name: 'Select Target Hardware' });
  await hardwareBtn.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'audit_hardware_dropdown.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
});
