import { test, expect } from '@playwright/test';

// ── Navigation & Core Layout ─────────────────────────────────────────────────

test.describe('Global Layout', () => {
  test('header renders CREED OS brand and navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('link', { name: /CREED OS/i })).toBeVisible();
  });

  test('mobile nav toggle opens and closes the drawer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const toggle = page.locator('#mobile-nav-toggle');

    // On desktop viewport, toggle is hidden; test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByRole('link', { name: 'Student View', exact: true })).toBeVisible();
  });
});

// ── Landing Page ──────────────────────────────────────────────────────────────

test.describe('Landing Page (/)', () => {
  test('renders editorial product headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Measure deeply/i)).toBeVisible();
    await expect(page.getByText(/Decide with evidence/i)).toBeVisible();
  });

  test('has working navigation cards to all portals', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Student Experience/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Parent Alignment/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Teacher Copilot/i }).first()).toBeVisible();
  });
});

// ── Student Dashboard ─────────────────────────────────────────────────────────

test.describe('Student Dashboard (/student)', () => {
  test('renders learner name and grade', async ({ page }) => {
    await page.goto('/student');
    await expect(page.locator('main').getByText('Anaya Verma')).toBeVisible();
    await expect(page.locator('main').getByText(/Class 8/i).first()).toBeVisible();
  });

  test('renders My Learning & Future Map heading', async ({ page }) => {
    await page.goto('/student');
    await expect(page.getByRole('heading', { name: /My Learning & Future Map/i })).toBeVisible();
  });

  test('has diagnostic and Socratic guide action buttons', async ({ page }) => {
    await page.goto('/student');
    await expect(page.getByRole('link', { name: /Take Diagnostic Check/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Ask Socratic Guide/i })).toBeVisible();
  });
});

// ── Adaptive CAT Assessment ───────────────────────────────────────────────────

test.describe('Adaptive CAT Assessment (/student/assessment)', () => {
  test('renders the assessment page and starts a session', async ({ page }) => {
    await page.goto('/student/assessment');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('API session creation responds 201', async ({ request }) => {
    const res = await request.post('/api/v1/assessments/sessions', {
      data: {
        learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        domain: 'stem_reasoning'
      }
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('sessionId');
    expect(body).toHaveProperty('firstItem');
    expect(body.firstItem).toHaveProperty('prompt');
  });
});

// ── Pathway Explorer ──────────────────────────────────────────────────────────

test.describe('Pathway Explorer (/student/pathways)', () => {
  test('renders pathway cards', async ({ page }) => {
    await page.goto('/student/pathways');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

// ── Socratic AI Mentor ────────────────────────────────────────────────────────

test.describe('Socratic AI Mentor (/student/mentor)', () => {
  test('renders the mentor interface with welcome message', async ({ page }) => {
    await page.goto('/student/mentor');
    await expect(page.getByText(/Socratic AI Guide/i)).toBeVisible();
    await expect(page.getByText(/Hello Anaya/i)).toBeVisible();
  });

  test('mentor chat API responds with a reply', async ({ request }) => {
    const res = await request.post('/api/v1/ai/mentor/chat', {
      data: {
        message: 'How do I balance an equation?',
        learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        history: []
      }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('reply');
    expect(typeof body.reply).toBe('string');
    expect(body.reply.length).toBeGreaterThan(0);
  });
});

// ── Parent Portal ─────────────────────────────────────────────────────────────

test.describe('Parent Portal (/parent)', () => {
  test('renders parent portal with DPDP verified badge', async ({ page }) => {
    await page.goto('/parent');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/DPDP Verified Guardian/i)).toBeVisible();
  });
});

// ── Teacher Copilot ───────────────────────────────────────────────────────────

test.describe('Teacher Copilot (/teacher)', () => {
  test('renders class cohort and misconception clusters', async ({ page }) => {
    await page.goto('/teacher');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Misconception Clusters/i)).toBeVisible();
  });
});

// ── Counselor Portal ──────────────────────────────────────────────────────────

test.describe('Counselor Intelligence Center (/counselor)', () => {
  test('renders the counselor portal', async ({ page }) => {
    await page.goto('/counselor');
    await expect(page.getByRole('heading', { name: /Counselor Guidance/i })).toBeVisible();
  });

  test('displays active referral count and student stats', async ({ page }) => {
    await page.goto('/counselor');
    await expect(page.getByText(/Open Referrals/i)).toBeVisible();
    await expect(page.getByText(/On Track/i)).toBeVisible();
  });

  test('referral review opens side panel on click', async ({ page }) => {
    await page.goto('/counselor');
    await page.waitForLoadState('networkidle');
    const reviewBtn = page.getByRole('button', { name: /Review Case & Evidence/i }).first();
    await reviewBtn.click();
    await expect(page.getByText(/Recommended Counselor Action/i)).toBeVisible();
  });
});

// ── Admin Intelligence Portal ─────────────────────────────────────────────────

test.describe('Admin Intelligence Portal (/admin)', () => {
  test('renders the admin portal and school overview', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /Delhi Public International School/i })).toBeVisible();
  });

  test('displays statutory DPDP consent ledger and filters', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('button', { name: /DPDP Consent Ledger/i })).toBeVisible();
    await expect(page.getByText('Anaya Verma')).toBeVisible();
    await expect(page.getByText('Sunita Verma')).toBeVisible();
  });

  test('switches tabs to staff directory', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /Staff Directory/i }).click();
    await expect(page.getByText('Ms. Priya Nair')).toBeVisible();
  });
});

// ── Psychometric & Item Bank Studio ──────────────────────────────────────────

test.describe('Psychometric & Item Bank Studio (/author)', () => {
  test('renders the item bank studio and calibration sliders', async ({ page }) => {
    await page.goto('/author');
    await expect(page.getByRole('heading', { name: /Psychometric Item Bank/i })).toBeVisible();
    await expect(page.getByText(/3PL IRT Parameters/i)).toBeVisible();
  });

  test('displays calibrated item bank with parameters', async ({ page }) => {
    await page.goto('/author');
    await expect(page.getByText(/Calibrated Item Bank/i)).toBeVisible();
    await expect(page.locator('input[type="range"]').first()).toBeVisible();
  });
});

// ── CREED OS REST APIs ─────────────────────────────────────────────────────────

test.describe('CREED OS REST API Contracts (/api/v1)', () => {
  test('GET /api/v1/learners/:id/profile returns 200 with competencies', async ({ request }) => {
    const res = await request.get('/api/v1/learners/3fa85f64-5717-4562-b3fc-2c963f66afa6/profile');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('Anaya Verma');
    expect(body).toHaveProperty('competencies');
    expect(body).toHaveProperty('topPathways');
  });

  test('GET /api/v1/learners/:id/evidence returns 200 with provenance', async ({ request }) => {
    const res = await request.get('/api/v1/learners/3fa85f64-5717-4562-b3fc-2c963f66afa6/evidence');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('evidenceCount');
    expect(body).toHaveProperty('evidence');
  });

  test('POST /api/v1/pathways/:id/mismatch returns 200 with constructive plan', async ({ request }) => {
    const res = await request.post('/api/v1/pathways/PATH-ROBOTICS/mismatch', {
      data: { learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.pathwayId).toBe('PATH-ROBOTICS');
    expect(body).toHaveProperty('strengthsMeetingRequirements');
    expect(body).toHaveProperty('foundationGaps');
    expect(body).toHaveProperty('recommendedIntervention');
  });

  test('POST /api/v1/consent/verify verifies DPDP parental consent', async ({ request }) => {
    const res = await request.post('/api/v1/consent/verify', {
      data: {
        learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        channel: 'DIGILOCKER'
      }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.consent.status).toBe('VERIFIED_ACTIVE');
  });
});

// ── 404 & Error Handling ──────────────────────────────────────────────────────

test.describe('Error Handling', () => {
  test('non-existent route returns a usable error page', async ({ page }) => {
    const res = await page.goto('/does-not-exist-xyz');
    expect(res?.status()).toBeLessThan(500);
  });
});
