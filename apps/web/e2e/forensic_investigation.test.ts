import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = path.resolve('test-results/screenshots/forensic');

test.describe('Forensic UI/UX Audit & Layout Verification', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  test.beforeEach(async ({ context }) => {
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
  });

  const viewports = [
    { name: 'desktop_1440', width: 1440, height: 900 },
    { name: 'desktop_1280', width: 1280, height: 800 },
    { name: 'tablet_landscape_1024', width: 1024, height: 768 },
    { name: 'tablet_portrait_768', width: 768, height: 1024 },
    { name: 'mobile_375', width: 375, height: 667 },
    { name: 'short_desktop_600', width: 1280, height: 600 },
    { name: 'short_tablet_600', width: 1024, height: 600 },
    { name: 'short_narrow_600', width: 768, height: 600 }
  ];

  for (const vp of viewports) {
    test(`Robotics IDE Layout Telemetry & Overflow at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/ide', { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);

      // Measure layout metrics in primary mode
      const primaryMetrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const ideHeader = document.querySelector('header.min-h-12');
        const ideContainer = ideHeader?.parentElement;
        const appSidebar = document.querySelector('aside, .shrink-0.sticky');
        const appMain = document.querySelector('main');
        const verifyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Verify'));

        const verifyRect = verifyBtn?.getBoundingClientRect();
        const headerRect = ideHeader?.getBoundingClientRect();
        const ideRect = ideContainer?.getBoundingClientRect();
        const sidebarRect = appSidebar?.getBoundingClientRect();
        const mainRect = appMain?.getBoundingClientRect();

        return {
          viewport: { w: window.innerWidth, h: window.innerHeight },
          shell: {
            sidebarWidth: sidebarRect ? Math.round(sidebarRect.width) : 0,
            mainWidth: mainRect ? Math.round(mainRect.width) : 0
          },
          ideContainer: ideRect ? {
            x: Math.round(ideRect.x),
            y: Math.round(ideRect.y),
            w: Math.round(ideRect.width),
            h: Math.round(ideRect.height)
          } : null,
          headerBounds: headerRect ? {
            x: Math.round(headerRect.x),
            y: Math.round(headerRect.y),
            w: Math.round(headerRect.width),
            h: Math.round(headerRect.height)
          } : null,
          docScroll: {
            scrollWidth: doc.scrollWidth,
            clientWidth: doc.clientWidth,
            scrollHeight: doc.scrollHeight,
            clientHeight: doc.clientHeight,
            hasDocHorizontalOverflow: doc.scrollWidth > doc.clientWidth,
            hasDocVerticalOverflow: doc.scrollHeight > doc.clientHeight
          },
          activeStage: 'primary',
          activeFocusTag: document.activeElement ? document.activeElement.tagName : 'NONE',
          verifyButton: (verifyRect && headerRect) ? {
            viewportX: Math.round(verifyRect.x),
            viewportY: Math.round(verifyRect.y),
            headerRelativeX: Math.round(verifyRect.x - headerRect.x),
            headerRelativeY: Math.round(verifyRect.y - headerRect.y),
            w: Math.round(verifyRect.width),
            h: Math.round(verifyRect.height),
            isClippedRight: (verifyRect.x + verifyRect.width) > window.innerWidth,
            isClippedBottom: (verifyRect.y + verifyRect.height) > window.innerHeight
          } : null
        };
      });

      console.log(`\n=== METRICS [${vp.name} - Primary] ===`);
      console.log(JSON.stringify(primaryMetrics, null, 2));

      expect(primaryMetrics.docScroll.hasDocHorizontalOverflow).toBe(false);
      if (primaryMetrics.ideContainer) {
        const expectedHeight = Math.min(920, Math.max(460, vp.height - 160));
        expect(primaryMetrics.ideContainer.h).toBe(expectedHeight);
      }
      if (primaryMetrics.verifyButton) {
        expect(primaryMetrics.verifyButton.isClippedRight).toBe(false);
        expect(primaryMetrics.verifyButton.isClippedBottom).toBe(false);
      }

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `ide_${vp.name}_primary.png`), fullPage: false });

      // Switch to Split Mode ('middle')
      const splitBtn = page.locator('button:has-text("Split")');
      if (await splitBtn.isVisible()) {
        await splitBtn.click();
        await page.waitForTimeout(600);

        const splitMetrics = await page.evaluate(() => {
          const doc = document.documentElement;
          const ideHeader = document.querySelector('header.min-h-12');
          const ideContainer = ideHeader?.parentElement;
          const workspaceRow = ideContainer?.querySelector('div.flex.flex-1.overflow-hidden');
          const panels = workspaceRow ? Array.from(workspaceRow.children) : [];

          const panelRects = panels.map((p, idx) => {
            const r = p.getBoundingClientRect();
            const cs = window.getComputedStyle(p);
            return {
              index: idx,
              tag: p.tagName,
              display: cs.display,
              width: Math.round(r.width),
              minWidth: cs.minWidth,
              clientWidth: (p as HTMLElement).clientWidth,
              scrollWidth: (p as HTMLElement).scrollWidth
            };
          });

          const totalPanelsWidth = panelRects.reduce((sum, p) => p.display !== 'none' ? sum + p.width : sum, 0);
          const workspaceWidth = workspaceRow ? Math.round(workspaceRow.getBoundingClientRect().width) : 0;

          return {
            hasDocHorizontalOverflow: doc.scrollWidth > doc.clientWidth,
            workspaceWidth,
            totalPanelsWidth,
            isPanelsOverflowingWorkspace: totalPanelsWidth > (workspaceWidth + 4),
            panelRects
          };
        });

        console.log(`=== METRICS [${vp.name} - Split Mode] ===`);
        console.log(JSON.stringify(splitMetrics, null, 2));

        expect(splitMetrics.hasDocHorizontalOverflow).toBe(false);
        expect(splitMetrics.isPanelsOverflowingWorkspace).toBe(false);

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `ide_${vp.name}_split.png`), fullPage: false });
      }
    });
  }

  test('Robotics IDE Dropdown Interaction, Dismissal & WAI-ARIA Semantics', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/ide', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const missionBtn = page.locator('button[aria-label="Select Robotics Mission"]');
    await expect(missionBtn).toBeVisible();

    // 1. Mouse Opening (resilient to hydration timing)
    await missionBtn.click();
    await page.waitForTimeout(300);
    const missionMenu = page.locator('div[role="menu"]').first();
    if (!await missionMenu.isVisible()) {
      await missionBtn.click();
      await page.waitForTimeout(200);
    }
    await expect(missionMenu).toBeVisible();

    // 2. Click INSIDE the menu container (propagation stopped -> remains open)
    const headerInMenu = missionMenu.locator('span:has-text("Guided Missions")');
    if (await headerInMenu.isVisible()) {
      await headerInMenu.click();
      await page.waitForTimeout(200);
      await expect(missionMenu).toBeVisible(); // Must NOT close on internal click
    }

    // 3. Press Escape to dismiss
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await expect(missionMenu).not.toBeVisible();

    // 4. Reopen and test outside-click dismissal
    await missionBtn.click();
    await page.waitForTimeout(200);
    await expect(missionMenu).toBeVisible();
    await page.mouse.click(500, 350); // Click outside in workbench canvas
    await page.waitForTimeout(200);
    await expect(missionMenu).not.toBeVisible();

    // 5. Open Project Dropdown and select an item
    const projectBtn = page.locator('button[aria-label="Project Actions"]');
    await expect(projectBtn).toBeVisible();
    await projectBtn.click();
    await page.waitForTimeout(200);
    const projectMenu = page.locator('div[role="menu"]').first();
    await expect(projectMenu).toBeVisible();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await expect(projectMenu).not.toBeVisible();
  });

  test('Mobile IDE (375px) End-to-End Mission Workflow & Usability', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/ide', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Verify header components are rendered and unclipped
    const header = page.locator('header.min-h-12');
    await expect(header).toBeVisible();

    const verifyBtn = header.locator('button:has-text("Verify")');
    await expect(verifyBtn).toBeVisible();
    const verifyBox = await verifyBtn.boundingBox();
    expect(verifyBox).not.toBeNull();
    if (verifyBox) {
      expect(verifyBox.x + verifyBox.width).toBeLessThanOrEqual(375);
    }

    // Switch to Code Mode
    const codeBtn = header.locator('button:has-text("Code")');
    await expect(codeBtn).toBeVisible();
    await codeBtn.click();
    await page.waitForTimeout(600);

    // Verify Code stage is active and unclipped
    const codeContainer = page.locator('.monaco-editor, textarea, pre').first();
    await expect(codeContainer).toBeVisible();

    // Switch back to Blocks Mode
    const blocksBtn = header.locator('button:has-text("Blocks")');
    await expect(blocksBtn).toBeVisible();
    await blocksBtn.click();
    await page.waitForTimeout(600);

    // Verify Run action can be triggered
    const runBtn = header.locator('button:has-text("Run Mission")');
    await expect(runBtn).toBeVisible();
    await runBtn.click();
    await page.waitForTimeout(400);

    // Click Verify button and assert no crash
    await verifyBtn.click();
    await page.waitForTimeout(600);

    // Document must have zero horizontal overflow throughout mobile workflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('Forensic Color & Categorized Contrast Verification across Light and Dark Themes', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1280, height: 800 });

    const routesToTest = [
      '/student/assessment',
      '/student/report',
      '/student/missions',
      '/student/pathways',
      '/settings'
    ];

    const results: any[] = [];

    for (const route of routesToTest) {
      for (const theme of ['light', 'dark']) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(400);

        // Apply theme and persist in localStorage
        await page.evaluate((t) => {
          try { localStorage.setItem('way_theme', t); } catch {}
          if (t === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            document.documentElement.setAttribute('data-theme', 'light');
          }
        }, theme);

        await page.waitForTimeout(300);

        // Capture screenshot
        const screenshotName = `${route.replace(/\//g, '_')}_${theme}.png`;
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, screenshotName), fullPage: false });

        // Forensically evaluate computed text styles with canvas sRGB conversion & alpha blending
        const elementsContrast = await page.evaluate(() => {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

          function getRgbChannels(colorStr: string): [number, number, number, number] {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = '#000000';
            ctx.fillStyle = colorStr;
            ctx.fillRect(0, 0, 1, 1);
            const data = ctx.getImageData(0, 0, 1, 1).data;
            return [data[0], data[1], data[2], data[3] / 255];
          }

          function getEffectiveBg(el: Element): [number, number, number] {
            let cur: Element | null = el;
            const isDark = document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark';
            let [r, g, b] = isDark ? [34, 38, 46] : [250, 250, 252];
            const stack: string[] = [];
            while (cur) {
              const bg = window.getComputedStyle(cur).backgroundColor;
              if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                stack.unshift(bg);
              }
              cur = cur.parentElement;
            }
            for (const cStr of stack) {
              const [cr, cg, cb, ca] = getRgbChannels(cStr);
              r = Math.round(cr * ca + r * (1 - ca));
              g = Math.round(cg * ca + g * (1 - ca));
              b = Math.round(cb * ca + b * (1 - ca));
            }
            return [r, g, b];
          }

          function getRelativeLuminance(r: number, g: number, b: number): number {
            const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c =>
              c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
            );
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
          }

          function calculateContrastRatio(c1: [number, number, number], c2: [number, number, number]): number {
            const l1 = getRelativeLuminance(c1[0], c1[1], c1[2]);
            const l2 = getRelativeLuminance(c2[0], c2[1], c2[2]);
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
          }

          const sampleElements = Array.from(document.querySelectorAll('h1, h2, h3, p, .text-muted, [class*="text-foreground"], [class*="text-ink"], button, span.font-mono'));

          const sampled = sampleElements.slice(0, 25).map(el => {
            const cs = window.getComputedStyle(el);
            const [fgR, fgG, fgB] = getRgbChannels(cs.color);
            const [bgR, bgG, bgB] = getEffectiveBg(el);
            const ratio = calculateContrastRatio([fgR, fgG, fgB], [bgR, bgG, bgB]);

            const fontSize = parseFloat(cs.fontSize) || 14;
            const fontWeight = parseInt(cs.fontWeight, 10) || 400;
            const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);

            return {
              tag: el.tagName,
              className: (el.getAttribute('class') || '').substring(0, 50),
              text: (el.textContent || '').trim().substring(0, 30),
              fgRgb: `rgb(${fgR}, ${fgG}, ${fgB})`,
              bgRgb: `rgb(${bgR}, ${bgG}, ${bgB})`,
              ratio: Math.round(ratio * 100) / 100,
              isLargeText
            };
          });

          return sampled;
        });

        for (const item of elementsContrast) {
          const required = item.isLargeText ? 3.0 : 4.5;
          results.push({
            route,
            theme,
            tag: item.tag,
            class: item.className,
            text: item.text,
            fg: item.fgRgb,
            bg: item.bgRgb,
            ratio: item.ratio,
            required,
            passed: item.ratio >= required
          });
        }
      }
    }

    console.log('\n=== REAL COMPOSITED COLOR CONTRAST AUDIT SUMMARY ===');
    const failures = results.filter(r => !r.passed && r.text.length > 0);
    const lightResults = results.filter(r => r.theme === 'light');
    const darkResults = results.filter(r => r.theme === 'dark');
    const lightFailures = lightResults.filter(r => !r.passed && r.text.length > 0);
    const darkFailures = darkResults.filter(r => !r.passed && r.text.length > 0);

    console.log(`Total samples evaluated: ${results.length}, Total Failures: ${failures.length}`);
    console.log(`  - Light theme: ${lightResults.length} samples, ${lightFailures.length} failures (Pass rate: ${(((lightResults.length - lightFailures.length) / lightResults.length) * 100).toFixed(1)}%)`);
    console.log(`  - Dark theme: ${darkResults.length} samples, ${darkFailures.length} failures (Pass rate: ${(((darkResults.length - darkFailures.length) / darkResults.length) * 100).toFixed(1)}%)`);

    if (failures.length > 0) {
      console.log('FAILING SAMPLES:', JSON.stringify(failures.slice(0, 10), null, 2));
    }
    const passRate = (results.length - failures.length) / results.length;
    console.log(`Measured WCAG AA Compliance Rate: ${(passRate * 100).toFixed(1)}%`);
    expect(passRate).toBeGreaterThanOrEqual(0.95);
  });

  test('DEF-10 Edge-Case Sub-Routes Verification (/teacher/lesson-plans, /admin, /parent/report)', async ({ page, context }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // 1. Audit /teacher/lesson-plans as teacher
    await context.addCookies([
      { name: 'creed_dev_role', value: 'teacher', url: 'http://localhost:5173' },
      {
        name: 'creed_dev_user',
        value: JSON.stringify({ id: 'usr_teacher', name: 'Teacher Copilot', email: 'teacher@core-os.app', role: 'teacher' }),
        url: 'http://localhost:5173'
      }
    ]);
    await page.goto('/teacher/lesson-plans', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const teacherH1 = page.locator('h1').first();
    await expect(teacherH1).toBeVisible();
    await expect(teacherH1).toContainText('Adaptive 3-Tier Differentiated Lesson Plan Studio');

    // Verify 3-tier structure exists
    const tier1 = page.locator('text=Tier 1').first();
    await expect(tier1).toBeVisible();

    // Toggle Author New Lesson Plan form and test interaction
    const authorBtn = page.locator('button:has-text("Author New Lesson Plan")');
    if (await authorBtn.isVisible()) {
      await authorBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('label:has-text("Lesson Title")')).toBeVisible();
      // Toggle back to list
      await page.locator('button:has-text("View Existing Plans")').click();
      await page.waitForTimeout(300);
    }

    const teacherOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(teacherOverflow).toBe(false);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'def10_teacher_lesson_plans.png'), fullPage: false });

    // 2. Audit /admin as admin (including audit-ledger, KPI layer, and inspector drawer)
    await context.addCookies([
      { name: 'creed_dev_role', value: 'admin', url: 'http://localhost:5173' },
      {
        name: 'creed_dev_user',
        value: JSON.stringify({ id: 'usr_admin', name: 'Admin Intelligence', email: 'admin@core-os.app', role: 'admin' }),
        url: 'http://localhost:5173'
      }
    ]);
    await page.goto('/admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const adminHeading = page.locator('h1').first();
    await expect(adminHeading).toBeVisible();
    await expect(adminHeading).toContainText('Operations');

    // Verify thin KPI layer
    await expect(page.locator('text=Affiliated Educational Institution')).toBeVisible();

    // Verify Statutory Compliance Audit Trail section
    const auditSection = page.locator('section#audit');
    await expect(auditSection).toBeVisible();
    await expect(auditSection.locator('text=Statutory Compliance & Audit Trail')).toBeVisible();

    // Test Inspect drawer on first consent record
    const inspectBtn = page.locator('button:has-text("Inspect")').first();
    if (await inspectBtn.isVisible()) {
      await inspectBtn.click();
      await page.waitForTimeout(300);
      const inspectorDrawer = page.locator('aside[aria-label="Details Inspector"]');
      await expect(inspectorDrawer).toBeVisible();
      // Close drawer cleanly
      await page.locator('button[aria-label="Close inspector"]').click();
      await page.waitForTimeout(300);
      await expect(inspectorDrawer).not.toBeVisible();
    }

    const adminOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(adminOverflow).toBe(false);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'def10_admin_audit.png'), fullPage: false });

    // 3. Audit /parent/report as parent (including zero psychometric leaks and domain switcher)
    await context.addCookies([
      { name: 'creed_dev_role', value: 'parent', url: 'http://localhost:5173' },
      {
        name: 'creed_dev_user',
        value: JSON.stringify({ id: 'usr_parent', name: 'Parent Guardian', email: 'parent@core-os.app', role: 'parent' }),
        url: 'http://localhost:5173'
      }
    ]);
    await page.goto('/parent/report', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const parentHeading = page.locator('h1').first();
    await expect(parentHeading).toBeVisible();
    await expect(parentHeading).toContainText('Family Diagnostic Guide & International Standing');

    // Verify DPDP trust badge
    await expect(page.locator('text=DPDP Act Verified • Parent Portal')).toBeVisible();

    // Verify Level 1 Signal: Developmental Summary for Parents
    await expect(page.locator('text=Developmental Summary for Parents')).toBeVisible();

    // Verify ZERO raw psychometric leaks on parent route
    const pageText = await page.evaluate(() => document.body.innerText);
    expect(pageText).not.toMatch(/\btheta\b/i);
    expect(pageText).not.toMatch(/θ/);
    expect(pageText).not.toMatch(/\bFisher Information\b/i);
    expect(pageText).not.toMatch(/3PL/i);
    expect(pageText).not.toMatch(/SE\s*=\s*\d/);

    // Test Domain Switcher
    const englishTab = page.locator('button:has-text("English & Communication")');
    if (await englishTab.isVisible()) {
      await englishTab.click();
      await page.waitForTimeout(300);
      await expect(page.locator('text=English & Communication').first()).toBeVisible();
    }

    const parentOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(parentOverflow).toBe(false);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'def10_parent_report.png'), fullPage: false });
  });
});
