import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import {
  toStudentBenchmarkReportDTO,
  toParentBenchmarkReportDTO,
  toSafeEvidenceDTO
} from '../src/lib/server/psychometricDto';
import { coreRepository } from '../src/lib/server/repository';

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

    // 1. Mouse Opening
    await missionBtn.click();
    const missionMenu = page.locator('div[role="menu"]').first();
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

    // 6. Test Escape priority in Fullscreen Studio Mode:
    // Enter Fullscreen mode
    const fullscreenToggle = page.locator('button:has-text("Fullscreen Studio ↗"), button[title*="fullscreen"], button[aria-label*="fullscreen"]').first();
    if (await fullscreenToggle.isVisible()) {
      await fullscreenToggle.click();
      await page.waitForTimeout(300);
      const fullscreenContainer = page.locator('div.fixed.inset-0.z-50');
      await expect(fullscreenContainer).toBeVisible();

      // Open mission dropdown inside fullscreen
      await missionBtn.click();
      await page.waitForTimeout(200);
      await expect(missionMenu).toBeVisible();

      // Press Escape -> MUST close dropdown, MUST retain fullscreen!
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      await expect(missionMenu).not.toBeVisible();
      await expect(fullscreenContainer).toBeVisible(); // Fullscreen is retained!

      // Press Escape again -> MUST exit fullscreen!
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      await expect(fullscreenContainer).not.toBeVisible();
    }
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

    // Virtual Keyboard Simulation (Height reduced to 340px)
    await page.setViewportSize({ width: 375, height: 340 });
    await page.waitForTimeout(300);

    // Measure layout viewport, visual viewport, and scroll state
    const keyboardTelemetry = await page.evaluate(() => {
      const headerEl = document.querySelector('header.min-h-12');
      const verifyBtnEl = headerEl ? Array.from(headerEl.querySelectorAll('button')).find(b => b.textContent?.includes('Verify')) : null;
      const verifyRect = verifyBtnEl ? verifyBtnEl.getBoundingClientRect() : null;

      return {
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight,
        visualViewportHeight: window.visualViewport ? window.visualViewport.height : window.innerHeight,
        scrollY: window.scrollY,
        documentScrollHeight: document.documentElement.scrollHeight,
        documentClientHeight: document.documentElement.clientHeight,
        unscrolledVerifyRect: verifyRect ? {
          x: verifyRect.x,
          y: verifyRect.y,
          w: verifyRect.width,
          h: verifyRect.height,
          bottom: verifyRect.bottom
        } : null
      };
    });
    console.log('=== MOBILE KEYBOARD TELEMETRY (375x340) ===', JSON.stringify(keyboardTelemetry, null, 2));

    // =========================================================================
    // LEVEL 1: DETERMINISTIC SCRIPT-POSITIONED SCROLLING (Programmatic Baseline)
    // =========================================================================
    // Documents deterministic coordinate placement under script-driven scroll.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);

    // Scripted repositioning: scroll down by 150px
    await page.evaluate(() => window.scrollBy(0, 150));
    await page.waitForTimeout(200);

    const level1Telemetry = await page.evaluate(() => {
      const headerEl = document.querySelector('header.min-h-12');
      const verifyBtnEl = headerEl ? Array.from(headerEl.querySelectorAll('button')).find(b => b.textContent?.includes('Verify')) : null;
      const verifyRect = verifyBtnEl ? verifyBtnEl.getBoundingClientRect() : null;

      return {
        mode: 'Level 1: Deterministic Script-Positioned (window.scrollBy)',
        scrollY: window.scrollY,
        verifyRect: verifyRect ? {
          x: verifyRect.x,
          y: verifyRect.y,
          w: verifyRect.width,
          h: verifyRect.height,
          bottom: verifyRect.bottom
        } : null
      };
    });
    console.log('=== [LEVEL 1: DETERMINISTIC SCRIPT-POSITIONED PLACEMENT] ===', JSON.stringify(level1Telemetry, null, 2));

    const scriptScrolledVerifyBox = await verifyBtn.boundingBox();
    expect(scriptScrolledVerifyBox).not.toBeNull();
    if (scriptScrolledVerifyBox) {
      expect(scriptScrolledVerifyBox.x + scriptScrolledVerifyBox.width).toBeLessThanOrEqual(375);
      expect(scriptScrolledVerifyBox.y).toBeGreaterThanOrEqual(0);
      expect(scriptScrolledVerifyBox.y + scriptScrolledVerifyBox.height).toBeLessThanOrEqual(340);
    }

    // =========================================================================
    // LEVEL 2: SIMULATED USER INPUT (Browser Input Event Dispatch via Wheel)
    // =========================================================================
    // Tests authentic browser user interaction using Playwright input APIs:
    // resets to top, dispatches page.mouse.wheel, and measures visual viewport offsets.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);

    // Position pointer in the main content canvas and issue mouse wheel scroll
    await page.mouse.move(187, 170);
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(400);

    const level2Telemetry = await page.evaluate(() => {
      const headerEl = document.querySelector('header.min-h-12');
      const verifyBtnEl = headerEl ? Array.from(headerEl.querySelectorAll('button')).find(b => b.textContent?.includes('Verify')) : null;
      const verifyRect = verifyBtnEl ? verifyBtnEl.getBoundingClientRect() : null;
      const vv = window.visualViewport;

      return {
        mode: 'Level 2: Simulated User Input (page.mouse.wheel)',
        scrollY: window.scrollY,
        visualViewport: vv ? {
          height: vv.height,
          width: vv.width,
          offsetTop: vv.offsetTop,
          pageTop: vv.pageTop
        } : null,
        verifyRect: verifyRect ? {
          x: verifyRect.x,
          y: verifyRect.y,
          w: verifyRect.width,
          h: verifyRect.height,
          bottom: verifyRect.bottom
        } : null
      };
    });
    console.log('=== [LEVEL 2: SIMULATED USER INPUT (page.mouse.wheel)] ===', JSON.stringify(level2Telemetry, null, 2));

    // Verify wheel input initiated document movement
    expect(level2Telemetry.scrollY).toBeGreaterThan(0);

    const userScrolledVerifyBox = await verifyBtn.boundingBox();
    expect(userScrolledVerifyBox).not.toBeNull();
    if (userScrolledVerifyBox) {
      expect(userScrolledVerifyBox.x + userScrolledVerifyBox.width).toBeLessThanOrEqual(375);
      expect(userScrolledVerifyBox.y).toBeGreaterThanOrEqual(0);
      expect(userScrolledVerifyBox.y + userScrolledVerifyBox.height).toBeLessThanOrEqual(340);
    }

    // LEVEL 3 NOTE: Native device & OS virtual keyboard resizing (e.g. iOS Safari / Android Chrome
    // visual viewport compression with software keyboard) requires a physical device test harness.
    // This is formally documented as Pending Gate 5 (Platform Operations & Mobile Hardware Lab).

    // Verify pointer activation succeeds at the user-scrolled position
    await verifyBtn.click();
    await page.waitForTimeout(300);

    // Verify keyboard activation (focus + Enter) succeeds
    await verifyBtn.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // Verify switching to Code mode remains operable under keyboard compression
    await codeBtn.click();
    await page.waitForTimeout(300);
    await expect(codeContainer).toBeVisible();

    // Switch cleanly back to Blocks mode
    await blocksBtn.click();
    await page.waitForTimeout(300);
    await expect(header).toBeVisible();

    // Verify Fullscreen Studio mode behavior under 375x340:
    // In Fullscreen mode, header is pinned at Y=0, so button is immediately reachable without any document scroll
    const fullscreenToggle = page.locator('button[aria-label="Expand studio to full screen"]').first();
    if (await fullscreenToggle.isVisible()) {
      await fullscreenToggle.click();
      await page.waitForTimeout(300);
      const fsVerifyBox = await verifyBtn.boundingBox();
      if (fsVerifyBox) {
        expect(fsVerifyBox.y).toBeGreaterThanOrEqual(0);
        expect(fsVerifyBox.y + fsVerifyBox.height).toBeLessThanOrEqual(340);
      }
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // Restore standard mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);

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
    // Exact unrounded mathematical calibration benchmarks
    const mathCalibration = await page.evaluate(() => {
      function sRGBtoLinear(c: number): number {
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      }
      function getLuminance(r: number, g: number, b: number): number {
        return 0.2126 * sRGBtoLinear(r / 255) + 0.7152 * sRGBtoLinear(g / 255) + 0.0722 * sRGBtoLinear(b / 255);
      }
      function getRatio(l1: number, l2: number): number {
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      const whiteL = getLuminance(255, 255, 255); // 1.0
      const blackL = getLuminance(0, 0, 0);       // 0.0
      const whiteBlackRatio = getRatio(whiteL, blackL); // exactly 21.0

      // #767676 (118/255)
      const gray76L = getLuminance(118, 118, 118);
      const gray76Ratio = getRatio(whiteL, gray76L); // ~4.542

      // Sub-threshold boundary: #777777 (119/255)
      const gray77L = getLuminance(119, 119, 119);
      const gray77Ratio = getRatio(whiteL, gray77L); // ~4.478 (< 4.5)

      // Generous boundary: #757575 (117/255)
      const gray75L = getLuminance(117, 117, 117);
      const gray75Ratio = getRatio(whiteL, gray75L); // ~4.608 (> 4.5)

      return {
        whiteBlackRatio,
        gray76Linear: sRGBtoLinear(118 / 255),
        gray77Linear: sRGBtoLinear(119 / 255),
        gray75Linear: sRGBtoLinear(117 / 255),
        gray76Ratio,
        gray77Ratio,
        gray75Ratio
      };
    });

    expect(Math.abs(mathCalibration.whiteBlackRatio - 21.0)).toBeLessThan(0.001);

    // Exact unrounded linear channel values (transfer function output before rounding):
    // #767676 (118/255): 0.181164
    expect(Math.abs(mathCalibration.gray76Linear - 0.181164)).toBeLessThan(0.00001);
    // #777777 (119/255): 0.184475
    expect(Math.abs(mathCalibration.gray77Linear - 0.184475)).toBeLessThan(0.00001);
    // #757575 (117/255): 0.177888
    expect(Math.abs(mathCalibration.gray75Linear - 0.177888)).toBeLessThan(0.00001);

    // Contrast assertions around 4.5:1 threshold:
    expect(Math.abs(mathCalibration.gray76Ratio - 4.542)).toBeLessThan(0.002);
    expect(mathCalibration.gray76Ratio).toBeGreaterThanOrEqual(4.50);
    expect(Math.abs(mathCalibration.gray77Ratio - 4.478)).toBeLessThan(0.002);
    expect(mathCalibration.gray77Ratio).toBeLessThan(4.50);
    expect(Math.abs(mathCalibration.gray75Ratio - 4.608)).toBeLessThan(0.002);
    expect(mathCalibration.gray75Ratio).toBeGreaterThan(4.50);

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

    // Verify Non-Misleading Parent Trust Badge (truthful domain-state copy)
    await expect(page.locator('text=Parent Verification Recorded • Parent Portal')).toBeVisible();

    // Verify Level 1 Signal: Developmental Summary for Parents
    await expect(page.locator('text=Developmental Summary for Parents')).toBeVisible();

    // Deep Psychometric Privacy Regression (Visible DOM text, accessibility content, and innerHTML)
    const pageText = await page.evaluate(() => document.body.innerText);
    expect(pageText).not.toMatch(/\btheta\b/i);
    expect(pageText).not.toMatch(/θ/);
    expect(pageText).not.toMatch(/\bFisher Information\b/i);
    expect(pageText).not.toMatch(/3PL/i);
    expect(pageText).not.toMatch(/SE\s*=\s*\d/);

    const pageHtml = await page.evaluate(() => document.body.innerHTML);
    expect(pageHtml).not.toMatch(/\btheta\b/i);
    expect(pageHtml).not.toMatch(/θ/);
    expect(pageHtml).not.toMatch(/\bfisher_info\b/i);
    expect(pageHtml).not.toMatch(/\bdiscrimination_a\b/i);
    expect(pageHtml).not.toMatch(/\bdifficulty_b\b/i);
    expect(pageHtml).not.toMatch(/\bguessing_c\b/i);

    // Structured JSON Hydration Payload Inspection:
    // Recursively parse and inspect every property in serialized script tags and client stores
    const jsonInspection = await page.evaluate(() => {
      const forbiddenTerms = [
        'theta',
        'standarderror',
        'standard_error',
        'se',
        '3pl',
        'fisher',
        'fisherinfo',
        'fisher_info',
        'discrimination',
        'difficulty',
        'guessing'
      ];
      const leaksFound: string[] = [];

      function checkObject(obj: any, path: string) {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) {
          obj.forEach((item, idx) => checkObject(item, `${path}[${idx}]`));
          return;
        }
        for (const [key, val] of Object.entries(obj)) {
          const lowerKey = key.toLowerCase();
          for (const term of forbiddenTerms) {
            if (lowerKey === term) {
              leaksFound.push(`Key '${key}' at path '${path}.${key}' matched forbidden term '${term}'`);
            }
          }
          checkObject(val, `${path}.${key}`);
        }
      }

      // Check all application/json script tags (SvelteKit hydration payloads)
      const scriptTags = Array.from(document.querySelectorAll('script[type="application/json"], script[data-sveltekit-fetched]'));
      for (const script of scriptTags) {
        try {
          const parsed = JSON.parse(script.textContent || '');
          checkObject(parsed, 'script_json');
        } catch {}
      }

      // Check window data structures if present
      if ((window as any).__sveltekit_data) {
        checkObject((window as any).__sveltekit_data, '__sveltekit_data');
      }

      return leaksFound;
    });

    // Strictly scoped crawler assertion:
    expect(
      jsonInspection,
      'No prohibited psychometric fields were detected in the enumerated hydration payloads for the tested routes and fixtures'
    ).toEqual([]);

    // Strict Role-Scoped DTO Schema Projection & Unknown Field Rejection Test:
    // Ensures internal psychometrics and unexpected properties never survive projection into student/parent DTOs
    const mockRawWithMaliciousFields = {
      domain: 'stem' as const,
      domainTitle: 'STEM Diagnostic',
      theta: 2.14,
      se: 0.18,
      standardError: 0.18,
      fisherInfo: 14.2,
      internal3PL: { a: 1.5, b: 0.2, c: 0.1 },
      unexpectedTopLevel: 'malicious_leak',
      percentileRank: 78,
      standardScaleScore: 540,
      scaleFormatted: '540 Ref Pts',
      globalComparison: {
        oecdAverage: 500,
        topDecileThreshold: 625,
        learnerScore: 540,
        deltaVsGlobalMean: 40
      },
      subCompetencies: [
        {
          name: 'Calculus',
          scoreRatio: 0.85,
          qualitativeStatus: 'Secure',
          evidenceNote: 'Demonstrated mastery',
          hiddenTheta: 1.8,
          unexpectedNestedProp: 'leak'
        }
      ],
      identifiedMisconceptions: [
        {
          tag: 'volume_neglect',
          label: 'Volume Neglect',
          severity: 'critical',
          frequency: 2,
          pedagogicalRemedy: 'Physical cylinder drill',
          restrictedInternalMeta: 'internal_only'
        }
      ],
      actionableRoadmap: [
        {
          week: 1,
          title: 'Week 1',
          focusArea: 'Spatial Reasoning',
          pedagogicalObjective: 'Objective 1',
          recommendedActivities: ['Activity 1'],
          primingQuestion: 'Question 1',
          internalAuditToken: 'forbidden_token'
        }
      ]
    };

    // 1. Pre-Gate 4 Default Gating: Student DTO (Numerical metrics withheld)
    const studentDtoPreG4 = toStudentBenchmarkReportDTO(mockRawWithMaliciousFields);
    expect(studentDtoPreG4).not.toBeNull();
    if (studentDtoPreG4) {
      expect(studentDtoPreG4.isGate4Calibrated).toBe(false);
      expect(studentDtoPreG4.calibrationStatus).toBe('DEVELOPMENTAL_UNLINKED');
      expect(studentDtoPreG4.percentileRank).toBeUndefined();
      expect(studentDtoPreG4.standardScaleScore).toBeUndefined();
      expect(studentDtoPreG4.scaleFormatted).toBeUndefined();
      expect((studentDtoPreG4 as any).globalComparison).toBeUndefined(); // Strictly withheld from student
      expect((studentDtoPreG4 as any).theta).toBeUndefined();
      expect((studentDtoPreG4 as any).se).toBeUndefined();
      expect((studentDtoPreG4 as any).standardError).toBeUndefined();
      expect((studentDtoPreG4 as any).fisherInfo).toBeUndefined();
      expect((studentDtoPreG4 as any).internal3PL).toBeUndefined();
      expect((studentDtoPreG4 as any).unexpectedTopLevel).toBeUndefined();
      expect((studentDtoPreG4.subCompetencies[0] as any).hiddenTheta).toBeUndefined();
      expect((studentDtoPreG4.subCompetencies[0] as any).unexpectedNestedProp).toBeUndefined();
      expect((studentDtoPreG4.identifiedMisconceptions[0] as any).restrictedInternalMeta).toBeUndefined();
      expect((studentDtoPreG4.actionableRoadmap[0] as any).internalAuditToken).toBeUndefined();
    }

    // =========================================================================
    // GATE 4 EXPLICIT PER-FIELD AUTHORIZATION REGRESSION SUITE (P0)
    // Enforces that global calibration prerequisite AND explicit per-field
    // allowlist authorization must BOTH be satisfied. If approvedFields is
    // omitted, empty, or unapproved, zero Gate 4 fields are exposed.
    // =========================================================================

    // Config 1: Switch missing, no allowlist -> All Gate 4 metrics withheld
    const cfg1Student = toStudentBenchmarkReportDTO(mockRawWithMaliciousFields, {});
    expect(cfg1Student?.isGate4Calibrated).toBe(false);
    expect(cfg1Student?.percentileRank).toBeUndefined();
    expect(cfg1Student?.standardScaleScore).toBeUndefined();
    expect(cfg1Student?.scaleFormatted).toBeUndefined();

    const cfg1Parent = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {});
    expect(cfg1Parent?.isGate4Calibrated).toBe(false);
    expect(cfg1Parent?.percentileRank).toBeUndefined();
    expect(cfg1Parent?.standardScaleScore).toBeUndefined();
    expect(cfg1Parent?.scaleFormatted).toBeUndefined();
    expect(cfg1Parent?.globalComparison).toBeUndefined();

    // Config 2: Switch true, approvedFields omitted -> All Gate 4 fields withheld (explicit authorization required)
    const cfg2OmittedStudent = toStudentBenchmarkReportDTO(mockRawWithMaliciousFields, { enableGate4Outputs: true });
    expect(cfg2OmittedStudent?.isGate4Calibrated).toBe(true);
    expect(cfg2OmittedStudent?.calibrationStatus).toBe('CALIBRATED');
    expect(cfg2OmittedStudent?.percentileRank).toBeUndefined();
    expect(cfg2OmittedStudent?.standardScaleScore).toBeUndefined();
    expect(cfg2OmittedStudent?.scaleFormatted).toBeUndefined();

    const cfg2OmittedParent = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, { enableGate4Outputs: true });
    expect(cfg2OmittedParent?.isGate4Calibrated).toBe(true);
    expect(cfg2OmittedParent?.calibrationStatus).toBe('CALIBRATED');
    expect(cfg2OmittedParent?.percentileRank).toBeUndefined();
    expect(cfg2OmittedParent?.standardScaleScore).toBeUndefined();
    expect(cfg2OmittedParent?.scaleFormatted).toBeUndefined();
    expect(cfg2OmittedParent?.globalComparison).toBeUndefined();

    // Config 3: Switch true, empty allowlist -> No Gate 4 fields exposed
    const cfg3Student = toStudentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: []
    });
    expect(cfg3Student?.isGate4Calibrated).toBe(true);
    expect(cfg3Student?.percentileRank).toBeUndefined();
    expect(cfg3Student?.standardScaleScore).toBeUndefined();
    expect(cfg3Student?.scaleFormatted).toBeUndefined();

    const cfg3Parent = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: []
    });
    expect(cfg3Parent?.isGate4Calibrated).toBe(true);
    expect(cfg3Parent?.percentileRank).toBeUndefined();
    expect(cfg3Parent?.standardScaleScore).toBeUndefined();
    expect(cfg3Parent?.scaleFormatted).toBeUndefined();
    expect(cfg3Parent?.globalComparison).toBeUndefined();

    // Config 4: Switch true, only one specifically authorized field -> Only that field exposed
    const cfg4Student = toStudentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['percentileRank']
    });
    expect(cfg4Student?.isGate4Calibrated).toBe(true);
    expect(cfg4Student?.percentileRank).toBe(78); // Specifically authorized
    expect(cfg4Student?.standardScaleScore).toBeUndefined(); // Withheld
    expect(cfg4Student?.scaleFormatted).toBeUndefined(); // Withheld

    const cfg4Parent = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['globalComparison'],
      isVerifiedGuardian: true
    });
    expect(cfg4Parent?.isGate4Calibrated).toBe(true);
    expect(cfg4Parent?.globalComparison).toBeDefined(); // Specifically authorized
    expect(cfg4Parent?.globalComparison?.deltaVsGlobalMean).toBe(40);
    expect(cfg4Parent?.percentileRank).toBeUndefined(); // Withheld
    expect(cfg4Parent?.standardScaleScore).toBeUndefined(); // Withheld

    // Config 5: Switch false, populated allowlist -> No Gate 4 fields exposed (switch fails closed)
    const cfg5Student = toStudentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: false,
      approvedFields: ['percentileRank']
    });
    expect(cfg5Student?.isGate4Calibrated).toBe(false);
    expect(cfg5Student?.percentileRank).toBeUndefined();
    expect(cfg5Student?.standardScaleScore).toBeUndefined();

    const cfg5Parent = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: false,
      approvedFields: ['percentileRank', 'globalComparison']
    });
    expect(cfg5Parent?.isGate4Calibrated).toBe(false);
    expect(cfg5Parent?.percentileRank).toBeUndefined();
    expect(cfg5Parent?.globalComparison).toBeUndefined();

    // Config 6: Malformed switch ("true" or 1), allowlist provided -> All Gate 4 metrics withheld
    const cfg6StringStudent = toStudentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: 'true' as any,
      approvedFields: ['percentileRank', 'standardScaleScore']
    });
    expect(cfg6StringStudent?.isGate4Calibrated).toBe(false);
    expect(cfg6StringStudent?.percentileRank).toBeUndefined();

    const cfg6NumberParent = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: 1 as any,
      approvedFields: ['percentileRank', 'globalComparison']
    });
    expect(cfg6NumberParent?.isGate4Calibrated).toBe(false);
    expect(cfg6NumberParent?.globalComparison).toBeUndefined();

    // Config 7: Unknown or disallowed field in allowlist -> Rejected and withheld
    const cfg7Student = toStudentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['theta' as any, 'malicious_leak' as any, 'unexpectedField' as any]
    });
    expect(cfg7Student?.isGate4Calibrated).toBe(true);
    expect(cfg7Student?.percentileRank).toBeUndefined();
    expect((cfg7Student as any).theta).toBeUndefined();

    const cfg7Parent = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['standardError' as any, 'internal3PL' as any]
    });
    expect(cfg7Parent?.isGate4Calibrated).toBe(true);
    expect(cfg7Parent?.globalComparison).toBeUndefined();
    expect((cfg7Parent as any).standardError).toBeUndefined();

    // Config 8: Explicit Full Authorization -> All authorized fields exposed per recipient
    const fullStudent = toStudentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['percentileRank', 'standardScaleScore', 'scaleFormatted']
    });
    expect(fullStudent?.isGate4Calibrated).toBe(true);
    expect(fullStudent?.percentileRank).toBe(78);
    expect(fullStudent?.standardScaleScore).toBe(540);
    expect(fullStudent?.scaleFormatted).toBe('540 Ref Pts');
    expect((fullStudent as any).globalComparison).toBeUndefined(); // Strictly excluded from student

    const fullParent = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['percentileRank', 'standardScaleScore', 'scaleFormatted', 'globalComparison'],
      isVerifiedGuardian: true
    });
    expect(fullParent?.isGate4Calibrated).toBe(true);
    expect(fullParent?.percentileRank).toBe(78);
    expect(fullParent?.standardScaleScore).toBe(540);
    expect(fullParent?.scaleFormatted).toBe('540 Ref Pts');
    expect(fullParent?.globalComparison?.deltaVsGlobalMean).toBe(40);
    expect(fullParent?.psychometricNotice).toContain('Calibrated benchmark output authorized under Gate 4');

    // Parental Identity & Relationship Boundary Scenarios (P0 Security Check):
    // Scenario 1: Verified parent, authorized relationship, calibrated output, explicit field approval -> Field returned
    const verifiedParentG4 = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['globalComparison', 'percentileRank'],
      isVerifiedGuardian: true
    });
    expect(verifiedParentG4?.globalComparison?.deltaVsGlobalMean).toBe(40);
    expect(verifiedParentG4?.percentileRank).toBe(78);

    // Scenario 2: Unverified parent, even with globalComparison in the allowlist -> Field withheld
    const unverifiedParentG4 = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['globalComparison', 'percentileRank'],
      isVerifiedGuardian: false
    });
    expect(unverifiedParentG4?.percentileRank).toBe(78);
    expect(unverifiedParentG4?.globalComparison).toBeUndefined();

    const omittedGuardianParentG4 = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['globalComparison']
    });
    expect(omittedGuardianParentG4?.globalComparison).toBeUndefined();

    // Scenario 4: Student serializer supplied with globalComparison -> Field never serialized
    const studentWithGlobal = toStudentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['globalComparison' as any, 'percentileRank']
    });
    expect(studentWithGlobal?.percentileRank).toBe(78);
    expect(studentWithGlobal?.globalComparison).toBeUndefined();
    expect('globalComparison' in (studentWithGlobal || {})).toBe(false);

    // 2. Pre-Gate 4 Default Gating: Parent DTO (Numerical & norm delta withheld)
    const parentDtoPreG4 = toParentBenchmarkReportDTO(mockRawWithMaliciousFields);
    expect(parentDtoPreG4).not.toBeNull();
    if (parentDtoPreG4) {
      expect(parentDtoPreG4.isGate4Calibrated).toBe(false);
      expect(parentDtoPreG4.calibrationStatus).toBe('DEVELOPMENTAL_UNLINKED');
      expect(parentDtoPreG4.percentileRank).toBeUndefined();
      expect(parentDtoPreG4.standardScaleScore).toBeUndefined();
      expect(parentDtoPreG4.scaleFormatted).toBeUndefined();
      expect(parentDtoPreG4.globalComparison).toBeUndefined(); // Withheld pre-Gate 4
      expect((parentDtoPreG4 as any).theta).toBeUndefined();
      expect((parentDtoPreG4 as any).se).toBeUndefined();
      expect((parentDtoPreG4 as any).internal3PL).toBeUndefined();
      expect((parentDtoPreG4 as any).unexpectedTopLevel).toBeUndefined();
      expect(parentDtoPreG4.psychometricNotice).toContain('Gate 4');
    }

    // 4. SafeEvidenceDTO: activityScore canonical field & backward compatibility
    const evidenceDto = toSafeEvidenceDTO({
      id: 'ev_1',
      learnerId: 'lrn_1',
      competencyId: 'comp_1',
      activityScore: 92,
      score: 92,
      theta: 1.45,
      itemParameters: { difficulty: 0.5 }
    });
    expect(evidenceDto.activityScore).toBe(92);
    expect(evidenceDto.score).toBe(92); // Deprecated alias retained for v3.0 migration window
    expect((evidenceDto as any).theta).toBeUndefined();
    expect((evidenceDto as any).itemParameters).toBeUndefined();

    // 5. Direct API Response Boundary & Authorization Verification:
    // Ensures direct JSON API responses conform to data minimization and contain zero psychometric leaks
    const studentHeaders = {
      Cookie: `creed_dev_session=true; creed_dev_role=student; creed_dev_user=${encodeURIComponent(JSON.stringify({ id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', role: 'student' }))}; creed_consent_verified=true;`
    };

    const apiProfileRes = await page.request.get('/api/v1/learners/3fa85f64-5717-4562-b3fc-2c963f66afa6/profile', {
      headers: studentHeaders
    });
    expect(apiProfileRes.status()).toBe(200);
    const apiProfileData = await apiProfileRes.json();
    expect(apiProfileData.learnerId).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
    const apiProfileString = JSON.stringify(apiProfileData).toLowerCase();
    expect(apiProfileString).not.toMatch(/"theta"/);
    expect(apiProfileString).not.toMatch(/"standarderror"/);
    expect(apiProfileString).not.toMatch(/"se"/);
    expect(apiProfileString).not.toMatch(/"fisher"/);
    expect(apiProfileString).not.toMatch(/"3pl"/);

    const apiEvidenceRes = await page.request.get('/api/v1/learners/3fa85f64-5717-4562-b3fc-2c963f66afa6/evidence', {
      headers: studentHeaders
    });
    expect(apiEvidenceRes.status()).toBe(200);
    const apiEvidenceData = await apiEvidenceRes.json();
    expect(Array.isArray(apiEvidenceData.evidence)).toBe(true);
    const apiEvidenceString = JSON.stringify(apiEvidenceData).toLowerCase();
    expect(apiEvidenceString).not.toMatch(/"theta"/);
    expect(apiEvidenceString).not.toMatch(/"standarderror"/);
    expect(apiEvidenceString).not.toMatch(/"itemparameters"/);

    // Cross-learner unauthorized read must be blocked with 403 Forbidden
    const crossProfileRes = await page.request.get('/api/v1/learners/other_unauthorized_id/profile', {
      headers: studentHeaders
    });
    expect(crossProfileRes.status()).toBe(403);

    // Scenario 3: Verified parent requesting another learner's report without an authorized relationship -> Access denied (403 Forbidden)
    const parentHeaders = {
      Cookie: `creed_dev_session=true; creed_dev_role=parent; creed_dev_user=${encodeURIComponent(JSON.stringify({ id: 'parent_1', learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', childLearnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', role: 'parent' }))}; creed_consent_verified=true;`
    };

    // --- Identity-to-Consent & Guardian Relationship Boundary Verifications ---
    // Test 1: Guardian A has consent; Guardian B requests the same learner -> Denied unless Guardian B has their own valid authorization
    const guardianBHeaders = {
      Cookie: `creed_dev_session=true; creed_dev_role=parent; creed_dev_user=${encodeURIComponent(JSON.stringify({ id: 'parent_2', learnerId: '9fa11b72-1204-4821-b3fa-110294821102', childLearnerId: '9fa11b72-1204-4821-b3fa-110294821102', role: 'parent' }))}; creed_consent_verified=true;`
    };
    // Guardian B attempts to query Guardian A's child (3fa85f64-5717-4562-b3fc-2c963f66afa6)
    const crossGuardianRes = await page.request.get('/parent/report?learnerId=3fa85f64-5717-4562-b3fc-2c963f66afa6', {
      headers: guardianBHeaders
    });
    expect(crossGuardianRes.status()).toBe(403); // Denied with 403 Forbidden
    // Direct repository check: Guardian B is NOT authorized for Guardian A's child despite active consent existing for that child
    expect(coreRepository.isVerifiedGuardianForLearner('parent_2', '3fa85f64-5717-4562-b3fc-2c963f66afa6')).toBe(false);
    expect(coreRepository.isVerifiedGuardianForLearner('parent_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')).toBe(true);

    // Test 2: Consent is revoked or expired -> Guardian-authorized access and restricted metrics are denied
    // Case A: Withdrawn consent
    coreRepository.withdrawConsent('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'Parent revoked consent under DPDP Act');
    expect(coreRepository.isVerifiedGuardianForLearner('parent_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')).toBe(false);
    const withdrawnParentG4 = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['globalComparison'],
      isVerifiedGuardian: coreRepository.isVerifiedGuardianForLearner('parent_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')
    });
    expect(withdrawnParentG4?.globalComparison).toBeUndefined(); // Withheld when consent is withdrawn

    // Case B: Expired consent
    coreRepository.expireConsent('3fa85f64-5717-4562-b3fc-2c963f66afa6');
    expect(coreRepository.isVerifiedGuardianForLearner('parent_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')).toBe(false);
    const expiredParentG4 = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['globalComparison'],
      isVerifiedGuardian: coreRepository.isVerifiedGuardianForLearner('parent_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')
    });
    expect(expiredParentG4?.globalComparison).toBeUndefined(); // Withheld when consent is expired

    // Case C: Missing consent guardian identity (record.guardianId is absent/undefined)
    // Restore active consent, but simulate a record missing the guardianId field
    coreRepository.restoreConsent('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'parent_1');
    const consentRecord = coreRepository.getConsentRecord('3fa85f64-5717-4562-b3fc-2c963f66afa6');
    expect(consentRecord).toBeDefined();
    if (consentRecord) {
      const backupGuardianId = consentRecord.guardianId;
      delete (consentRecord as any).guardianId;

      // Invariant: Unconditional identity-to-consent binding requires record.guardianId to be present and match
      // Even though registered relationship exists for parent_1 and status is VERIFIED_ACTIVE, missing guardianId must reject
      expect(coreRepository.isVerifiedGuardianForLearner('parent_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')).toBe(false);
      const missingGuardianG4 = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
        enableGate4Outputs: true,
        approvedFields: ['globalComparison'],
        isVerifiedGuardian: coreRepository.isVerifiedGuardianForLearner('parent_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')
      });
      expect(missingGuardianG4?.globalComparison).toBeUndefined(); // Denied when guardianId is absent on consent record

      // Case D: Conflicting consent guardian identity (record.guardianId points to a different guardian)
      // Even though registered relationship exists for parent_1, conflicting record.guardianId must reject
      consentRecord.guardianId = 'conflicting_guardian_99';
      expect(coreRepository.isVerifiedGuardianForLearner('parent_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')).toBe(false);
      const conflictingGuardianG4 = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
        enableGate4Outputs: true,
        approvedFields: ['globalComparison'],
        isVerifiedGuardian: coreRepository.isVerifiedGuardianForLearner('parent_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')
      });
      expect(conflictingGuardianG4?.globalComparison).toBeUndefined(); // Denied when guardianId mismatches

      // Restore legitimate guardian identity
      consentRecord.guardianId = backupGuardianId;
      expect(coreRepository.isVerifiedGuardianForLearner('parent_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')).toBe(true);
    }

    // Restore clean consent state for subsequent tests
    coreRepository.restoreConsent('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'parent_1');
    expect(coreRepository.isVerifiedGuardianForLearner('parent_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')).toBe(true);

    // Test 3: Administrator requests parent-only metrics without an explicit authorized access grant -> Denied
    expect(coreRepository.isVerifiedGuardianForLearner('admin_1', '3fa85f64-5717-4562-b3fc-2c963f66afa6')).toBe(false);
    const adminG4Attempt = toParentBenchmarkReportDTO(mockRawWithMaliciousFields, {
      enableGate4Outputs: true,
      approvedFields: ['globalComparison', 'percentileRank'],
      isVerifiedGuardian: false // Admins are not parents/guardians and cannot inherit guardian status
    });
    expect(adminG4Attempt?.globalComparison).toBeUndefined(); // Denied
    expect(adminG4Attempt?.percentileRank).toBe(78); // Other approved fields deserialize if broad access is granted

    // Test 4: Guardian requests a learner outside their authorized relationship -> HTTP 403 Forbidden
    const crossParentReportRes = await page.request.get('/parent/report?learnerId=other_unauthorized_learner_id', {
      headers: parentHeaders
    });
    expect(crossParentReportRes.status()).toBe(403);

    const crossParentApiRes = await page.request.get('/api/v1/learners/other_unauthorized_learner_id/profile', {
      headers: parentHeaders
    });
    expect(crossParentApiRes.status()).toBe(403);

    // Test 5: Legitimately authorized guardian requests globalComparison before Gate 4 approval -> Field remains withheld
    const legitimateParentPreG4Res = await page.request.get('/parent/report?enableGate4Outputs=true&approvedFields=globalComparison', {
      headers: parentHeaders
    });
    expect(legitimateParentPreG4Res.status()).toBe(200);
    const legitimateParentPreG4Html = await legitimateParentPreG4Res.text();
    expect(legitimateParentPreG4Html).not.toMatch(/"globalComparison":\s*\{/);
    expect(legitimateParentPreG4Html).not.toContain('deltaVsGlobalMean');

    // Test Domain Switcher
    const englishTab = page.locator('button:has-text("English & Communication")');
    if (await englishTab.isVisible()) {
      await englishTab.click();
      await page.waitForTimeout(300);
      await expect(page.locator('text=English & Communication').first()).toBeVisible();
    }

    // 6. Caller Boundary & Client Parameter Tamper Resistance:
    // Assert that client-supplied query parameters (?enableGate4Outputs=true&approvedFields=percentileRank)
    // CANNOT activate the global calibration switch or serialize gated metrics into hydration payloads.
    await page.goto('/student/report?enableGate4Outputs=true&approvedFields=percentileRank&approvedFields=standardScaleScore', { waitUntil: 'networkidle' });
    const studentPageContent = await page.content();
    expect(studentPageContent).not.toMatch(/"percentileRank":\s*\d+/);
    expect(studentPageContent).not.toMatch(/"standardScaleScore":\s*\d+/);
    expect(studentPageContent).toContain('DEVELOPMENTAL_UNLINKED');
    expect(studentPageContent).toContain('Gate 4 In Progress');

    // Test parent route with malicious client query parameter tampering
    await page.goto('/parent/report?enableGate4Outputs=true&approvedFields=globalComparison,percentileRank', { waitUntil: 'networkidle' });
    const parentPageContent = await page.content();
    expect(parentPageContent).not.toMatch(/"percentileRank":\s*\d+/);
    expect(parentPageContent).not.toMatch(/"globalComparison":\s*\{/);
    expect(parentPageContent).not.toContain('globalComparison');
    expect(parentPageContent).toContain('DEVELOPMENTAL_UNLINKED');

    const parentOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(parentOverflow).toBe(false);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'def10_parent_report.png'), fullPage: false });
  });
});
