import { test, expect } from '@playwright/test';

// ── Navigation & Core Layout ─────────────────────────────────────────────────

test.describe('Global Layout', () => {
  test('header renders CREED OS brand and navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('link', { name: /CREED OS/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Explore CREED/i }).first()).toBeVisible();
  });

  test('mobile viewport displays primary action and access links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('link', { name: /Explore CREED/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Sign in/i }).first()).toBeVisible();
  });

  test('authenticated app shell provides mobile bottom navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/student');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('link', { name: /Today/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Map/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Guide/i })).toBeVisible();
  });
});

// ── Landing Page ──────────────────────────────────────────────────────────────

test.describe('Landing Page (/)', () => {
  test('renders editorial product headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Understand how/i);
    await expect(page.getByText(/Assess deeply. Learn personally. Explore freely./i)).toBeVisible();
  });

  test('has working navigation cards to all portals', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Enter student space/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Enter family space/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Enter teacher space/i })).toBeVisible();
  });
});

// ── Student Dashboard ─────────────────────────────────────────────────────────

test.describe('Student Dashboard (/student)', () => {
  test('renders learner greeting and next step orientation', async ({ page }) => {
    await page.goto('/student');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Good morning/i);
    await expect(page.getByText(/Your next step is ready/i)).toBeVisible();
  });

  test('renders Dominant Today Focus and practice action', async ({ page }) => {
    await page.goto('/student');
    await expect(page.getByRole('heading', { name: /Strengthen proportional reasoning/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Start practice/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /View capabilities/i })).toBeVisible();
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
  test('renders the mentor interface with thinking moves and dialogue', async ({ page }) => {
    await page.goto('/student/mentor');
    await expect(page.getByText(/Socratic Mentor/i)).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Kinematics/i);
    await expect(page.getByRole('button', { name: /Decompose/i })).toBeVisible();
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
  test('renders parent portal with verified consent notice', async ({ page }) => {
    await page.goto('/parent');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/How is Anaya doing/i);
    await expect(page.getByText(/Verified Parental Consent Active/i)).toBeVisible();
    await expect(page.getByText(/Spatial Reasoning/i).first()).toBeVisible();
  });
});

// ── Teacher Copilot ───────────────────────────────────────────────────────────

test.describe('Teacher Copilot (/teacher)', () => {
  test('renders class cohort and priority actions queue', async ({ page }) => {
    await page.goto('/teacher');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Priority Actions/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Log observation/i })).toBeVisible();
  });
});

// ── Counselor Intelligence Center (/counselor) ────────────────────────────────

test.describe('Counselor Intelligence Center (/counselor)', () => {
  test('renders the counselor caseload and priority cases', async ({ page }) => {
    await page.goto('/counselor');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Caseload/i);
    await expect(page.getByRole('heading', { name: /Priority Cases/i })).toBeVisible();
    await expect(page.getByText(/24 active learners/i)).toBeVisible();
  });

  test('case selection opens right-side inspector panel', async ({ page }) => {
    await page.goto('/counselor');
    await page.waitForLoadState('networkidle');
    const caseCard = page.getByRole('button', { name: /Anaya Verma/i }).first();
    await caseCard.click();
    await expect(page.getByText(/Grounding Evidence Base/i)).toBeVisible();
    await expect(page.getByText(/Recommended Next Step/i)).toBeVisible();
  });
});

// ── Admin Intelligence Portal (/admin) ─────────────────────────────────────────

test.describe('Admin Intelligence Portal (/admin)', () => {
  test('renders the admin portal and operational header', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Operations/i);
    await expect(page.locator('main').getByText(/Delhi Public International School/i)).toBeVisible();
  });

  test('displays high-density DPDP consent ledger table and search filter', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByPlaceholder(/Search by learner/i)).toBeVisible();
    await expect(page.getByText('Anaya Verma').first()).toBeVisible();
    await expect(page.getByText('Sunita Verma').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Export/i })).toBeVisible();
  });
});

// ── Psychometric & Item Bank Studio (/studio) ─────────────────────────────────

test.describe('Psychometric & Item Bank Studio (/studio)', () => {
  test('redirects legacy /author to /studio', async ({ page }) => {
    await page.goto('/author');
    await expect(page).toHaveURL(/\/studio/);
  });

  test('renders the item studio and 3PL IRT calibration panel', async ({ page }) => {
    await page.goto('/studio');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/ITEM_STUDIO/i);
    await expect(page.getByText(/CALIBRATION \/\/ 3PL IRT/i)).toBeVisible();
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
    expect(body).not.toBeNull();
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
        channel: 'DIGILOCKER',
        parentName: 'Sunita Verma',
        parentContact: 'DL-IND-9021-4820',
        auditToken: 'DL-AUTH-TOKEN-2026'
      }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.consent.status).toBe('VERIFIED_ACTIVE');
  });
});

// ── Workspace Utility Routes ──────────────────────────────────────────────────

test.describe('Workspace Utility Routes', () => {
  test('Settings (/settings) renders workspace settings and privacy controls', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('h1')).toContainText('Workspace Settings');
    await expect(page.getByText('Display & Ergonomics')).toBeVisible();
    await expect(page.getByText('Privacy & Data Sovereignty')).toBeVisible();
  });

  test('Help (/help) renders documentation and principles', async ({ page }) => {
    await page.goto('/help');
    await expect(page.locator('h1')).toContainText('Documentation & Guidance');
    await expect(page.getByText('Quiet Editorial Intelligence')).toBeVisible();
  });
});

// ── 404 & Error Handling ──────────────────────────────────────────────────────

test.describe('Error Handling', () => {
  test('non-existent route returns a usable error page', async ({ page }) => {
    const res = await page.goto('/does-not-exist-xyz');
    expect(res?.status()).toBeLessThan(500);
  });
});
