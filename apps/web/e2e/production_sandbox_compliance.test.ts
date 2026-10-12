import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Production Sandbox & Open Source Licensing Compliance', () => {
  test('should verify Section 6 compliance, interactive SBOM filtering, and modal triggers', async ({ page, context }, testInfo) => {
    const outDir = 'C:/Users/rtf70/.gemini/antigravity-ide/brain/003c2140-b0c1-49b6-ac6e-7636f2889ed7';

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

    // 1. Verify Quick Header Licenses button exists
    const quickLicensesBtn = page.getByTitle('Inspect Open Source Software Bill of Materials (SBOM) and License Notices');
    await expect(quickLicensesBtn).toBeVisible();

    // 2. Click Section 6 Architecture & Licenses nav button
    const isMobile = testInfo.project.name.toLowerCase().includes('mobile');
    if (!isMobile) {
      const sec6Nav = page.locator('button:has-text("6. Architecture & Licenses")');
      await expect(sec6Nav).toBeVisible();
      await sec6Nav.click();
    } else {
      const sec6NavMobile = page.locator('button:has-text("6. Licenses")');
      await expect(sec6NavMobile).toBeVisible();
      await sec6NavMobile.click();
    }
    await page.waitForTimeout(600);

    // 3. Verify Section 6 heading & 4 pillar cards
    const sec6Heading = page.locator('text=Clean-Room Verification & Dependency License Ledger');
    await expect(sec6Heading).toBeVisible();

    await expect(page.locator('text=0 AGPL Taint')).toBeVisible();
    await expect(page.locator('text=Blockly 13.3')).toBeVisible();
    await expect(page.locator('text=Pyodide WASM')).toBeVisible();
    await expect(page.locator('text=100% Original')).toBeVisible();

    // 4. Verify Interactive SBOM & Filtering
    const searchInput = page.locator('input[placeholder*="Filter packages..."]');
    await expect(searchInput).toBeVisible();

    // Filter by Apache-2.0 button
    const apacheFilterBtn = page.locator('button:has-text("Apache-2.0")').first();
    await apacheFilterBtn.click();
    await page.waitForTimeout(300);

    // Verify filtered table contains blockly
    await expect(page.locator('table td:has-text("blockly")').first()).toBeVisible();

    // Reset filter to all
    const allFilterBtn = page.locator('button:has-text("all")').first();
    await allFilterBtn.click();
    await page.waitForTimeout(300);

    // Search by typing pyodide
    await searchInput.fill('pyodide');
    await page.waitForTimeout(300);
    await expect(page.locator('table td:has-text("pyodide")').first()).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(300);

    await page.screenshot({ path: path.join(outDir, 'e2e_compliance_01_section6_sbom.png'), fullPage: false });

    // 5. Click "Full License Notices ↗" button in Section 6
    const fullNoticesBtn = page.locator('button:has-text("Full License Notices ↗")');
    await expect(fullNoticesBtn).toBeVisible();
    await fullNoticesBtn.click();
    await page.waitForTimeout(500);

    // Verify modal opened
    const modal = page.locator('div.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();
    await expect(page.locator('text=Open Source Architecture & License Compliance')).toBeVisible();

    // Tab 1: Clean-Room Verification
    await expect(page.locator('text=Zero AGPL-3.0 Copyleft Contamination')).toBeVisible();
    await page.screenshot({ path: path.join(outDir, 'e2e_compliance_02_modal_cleanroom.png') });

    // Switch to Tab 2: Dependency SBOM
    const tabSbom = page.locator('button:has-text("2. Dependency SBOM")');
    await tabSbom.click();
    await page.waitForTimeout(300);
    await expect(page.locator('table td:has-text("blockly")').first()).toBeVisible();
    await page.screenshot({ path: path.join(outDir, 'e2e_compliance_03_modal_sbom.png') });

    // Switch to Tab 3: Legal Texts & Notices
    const tabLegal = page.locator('button:has-text("3. Legal Texts & Notices")');
    await tabLegal.click();
    await page.waitForTimeout(300);
    await expect(page.locator('text=Apache License, Version 2.0').first()).toBeVisible();
    await expect(page.locator('text=Mozilla Public License Version 2.0').first()).toBeVisible();
    await page.screenshot({ path: path.join(outDir, 'e2e_compliance_04_modal_legal.png') });

    // Switch to Tab 4: Architectural Seam Map
    const tabSeam = page.locator('button:has-text("4. Architectural Seam Map")');
    await tabSeam.click();
    await page.waitForTimeout(300);
    await expect(page.locator('text=Upstream Monorepo (AGPL-3.0)').first()).toBeVisible();
    await expect(page.locator('text=CREED OS Clean-Room (Apache/MIT)').first()).toBeVisible();
    await page.screenshot({ path: path.join(outDir, 'e2e_compliance_05_modal_seam.png') });

    // Close modal via Close Notices footer button
    const closeBtn = page.locator('button:has-text("Close Notices")');
    await closeBtn.click();
    await page.waitForTimeout(300);
    await expect(modal).not.toBeVisible();

    // 6. Test BrowserIDE Project dropdown -> Open Source & Licenses trigger
    // Switch to section 1 (Robotics IDE)
    if (!isMobile) {
      const sec1Nav = page.locator('button:has-text("1. Robotics IDE")');
      await expect(sec1Nav).toBeVisible();
      await sec1Nav.click();
    } else {
      const sec1NavMobile = page.locator('button:has-text("1. Robotics")').last();
      await expect(sec1NavMobile).toBeVisible();
      await sec1NavMobile.click();
    }
    await page.waitForTimeout(600);

    const projectDropdownBtn = page.locator('button[aria-label="Project Actions"]');
    if (await projectDropdownBtn.isVisible()) {
      await projectDropdownBtn.click();
      await page.waitForTimeout(300);
      const licenseMenuItem = page.locator('button:has-text("Open Source & Licenses")');
      await expect(licenseMenuItem).toBeVisible();
      await licenseMenuItem.click();
      await page.waitForTimeout(400);
      await expect(modal).toBeVisible();

      // Close modal again using header close button
      const closeTopBtn = page.locator('button[aria-label="Close dialog"]');
      await closeTopBtn.click();
      await page.waitForTimeout(300);
      await expect(modal).not.toBeVisible();
    }
  });
});
