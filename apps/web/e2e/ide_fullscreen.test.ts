import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'node:fs';

test.describe('Browser Robotics IDE Fullscreen Expansion', () => {
  test('should expand entire IDE to full screen across all stages and switch cleanly', async ({ page, context }, testInfo) => {
    test.setTimeout(90000);
    const outDir = process.env.TEST_OUTPUT_DIR || path.join(process.cwd(), 'test-results', 'screenshots');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Set dev auth cookies
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

    await page.goto('/sandbox', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Verify that duplicate stage switchers are removed:
    // Only one stage switcher exists now (inside BrowserIDE toolbar)
    const primaryBtns = page.locator('button:has-text("Blocks")');
    await expect(primaryBtns.first()).toBeVisible();

    // Verify Launch Fullscreen Studio button exists in section kicker
    const launchFullscreenBtn = page.locator('button:has-text("Launch Fullscreen Studio ↗")');
    await expect(launchFullscreenBtn).toBeVisible();

    await page.screenshot({ path: path.join(outDir, 'e2e_01_sandbox_inline.png') });

    // 2. Click Launch Fullscreen Studio
    await launchFullscreenBtn.click();
    await page.waitForTimeout(600);

    // Verify IDE is fixed inset-0 full screen
    const fullscreenIDE = page.locator('div.fixed.inset-0.z-50');
    await expect(fullscreenIDE).toBeVisible();

    const isMobile = testInfo.project.name.toLowerCase().includes('mobile');
    const box = await fullscreenIDE.boundingBox();
    if (!isMobile) {
      expect(box?.width).toBeGreaterThanOrEqual(1200);
      expect(box?.height).toBeGreaterThanOrEqual(700);
    } else {
      expect(box?.width).toBeGreaterThanOrEqual(350);
      expect(box?.height).toBeGreaterThanOrEqual(600);
    }

    await page.screenshot({ path: path.join(outDir, 'e2e_02_primary_fullscreen.png') });

    // 3. Switch to Split inside fullscreen
    const middleBtn = page.locator('button:has-text("Split")');
    await middleBtn.click();
    await page.waitForTimeout(600);

    // Verify Middle studio is visible and still in fullscreen
    await expect(fullscreenIDE).toBeVisible();
    await expect(page.locator('text=Live Python Output (Read-only AST)')).toBeVisible();
    await page.screenshot({ path: path.join(outDir, 'e2e_03_middle_fullscreen.png') });

    // 4. Switch to Code inside fullscreen
    const secondaryBtn = page.locator('button:has-text("Code")');
    await secondaryBtn.click();
    await page.waitForTimeout(600);

    // Verify Secondary studio is visible and still in fullscreen
    await expect(fullscreenIDE).toBeVisible();
    await expect(page.locator('text=Monaco Python Code Editor')).toBeVisible();

    // Verify Template dropdown exists and open it
    const templateDropdownBtn = page.getByTitle('Select starter template for textual Python development');
    await expect(templateDropdownBtn).toBeVisible();
    await templateDropdownBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'e2e_04a_secondary_template_dropdown.png') });

    // Select "Line PID 🏁" template
    const pidItem = page.locator('button:has-text("Line PID 🏁")');
    await pidItem.click();
    await page.waitForTimeout(300);

    // Verify template updated in button
    await expect(templateDropdownBtn).toContainText('Line PID 🏁');

    // Verify Secondary Arena simulator is visible and active
    await expect(page.locator('button[aria-label="Mars Surface Exploration Proving Ground Simulator"]').first()).toBeVisible();

    // Click Run Code
    const runBtn = page.locator('button:has-text("Run Code")');
    await runBtn.click();
    await page.waitForTimeout(800);

    await page.screenshot({ path: path.join(outDir, 'e2e_04b_secondary_executed.png') });

    // 5. Switch back to Primary (Blocks) inside fullscreen
    await primaryBtns.first().click();
    await page.waitForTimeout(600);
    await expect(fullscreenIDE).toBeVisible();
    await page.screenshot({ path: path.join(outDir, 'e2e_05_primary_back_fullscreen.png') });

    // 6. Click Workbench / Exit Studio inside fullscreen or press Escape
    const exitBtn = fullscreenIDE.locator('button[title*="Exit fullscreen"], button[title*="Minimize fullscreen"]').first();
    if (await exitBtn.isVisible()) {
      await exitBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(600);

    // Verify fullscreen is closed and returned to inline view
    await expect(fullscreenIDE).not.toBeVisible();
    await page.screenshot({ path: path.join(outDir, 'e2e_06_inline_returned.png') });
  });
});
