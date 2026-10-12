import { test } from '@playwright/test';

test('inspect all scrollbars in blocklyContainer', async ({ page, context }) => {
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

  // Click Launch Fullscreen Studio
  await page.click('button:has-text("Launch Fullscreen Studio ↗")');
  await page.waitForTimeout(600);

  // Check all elements inside injectionDiv
  const scrollbars = await page.evaluate(() => {
    const s = document.querySelectorAll('.blocklyScrollbarVertical, .blocklyScrollbarHorizontal, .blocklyScrollbarHandle, .blocklyFlyoutScrollbar');
    return Array.from(s).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        className: el.getAttribute('class'),
        tag: el.tagName,
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        w: Math.round(rect.width),
        h: Math.round(rect.height),
        html: el.outerHTML.substring(0, 150)
      };
    });
  });

  console.log('--- ALL BLOCKLY SCROLLBAR ELEMENTS ---');
  console.log(JSON.stringify(scrollbars, null, 2));
});
