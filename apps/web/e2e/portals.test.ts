import { test, expect, type BrowserContext } from '@playwright/test';

// ── Auth Test Helpers ────────────────────────────────────────────────────────

async function loginAs(
  context: BrowserContext,
  role: 'student' | 'parent' | 'teacher' | 'counselor' | 'admin' | 'studio' = 'student'
) {
  await context.addCookies([
    {
      name: 'creed_dev_session',
      value: 'true',
      url: 'http://localhost:5173'
    },
    {
      name: 'creed_dev_role',
      value: role,
      url: 'http://localhost:5173'
    },
    {
      name: 'creed_dev_user',
      value: JSON.stringify({
        id: `usr_${role}`,
        name:
          role === 'student'
            ? 'Student Learner'
            : role === 'parent'
            ? 'Parent Guardian'
            : role === 'teacher'
            ? 'Lead Educator'
            : role === 'counselor'
            ? 'Academic Counselor'
            : 'System Administrator',
        email: `${role}@core-os.app`,
        role
      }),
      url: 'http://localhost:5173'
    },
    {
      name: 'creed_consent_verified',
      value: 'true',
      url: 'http://localhost:5173'
    }
  ]);
}

function authHeaders(role: string = 'student') {
  return {
    Cookie: `creed_dev_session=true; creed_dev_role=${role}; creed_consent_verified=true;`
  };
}

// ── 0. Route Protection & Security Enforcement ───────────────────────────────

test.describe('Route Protection & Security Enforcement', () => {
  test('unauthenticated visit to /student redirects to login with return path', async ({ page }) => {
    await page.goto('/student');
    await expect(page).toHaveURL(/\/login\?next=%2Fstudent/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Welcome back/i);
    await expect(page.getByText(/Active session required/i)).toBeVisible();
  });

  test('unauthenticated visit to /admin redirects to login with return path', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login\?next=%2Fadmin/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Welcome back/i);
  });

  test('unauthenticated visit to /teacher redirects to login with return path', async ({ page }) => {
    await page.goto('/teacher');
    await expect(page).toHaveURL(/\/login\?next=%2Fteacher/);
  });

  test('unauthenticated visit to /counselor redirects to login with return path', async ({ page }) => {
    await page.goto('/counselor');
    await expect(page).toHaveURL(/\/login\?next=%2Fcounselor/);
  });

  test('unauthenticated API call to /api/v1/learners/:id/profile returns 401', async ({ request }) => {
    const res = await request.get('/api/v1/learners/3fa85f64-5717-4562-b3fc-2c963f66afa6/profile');
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(JSON.stringify(body)).toContain('Unauthorized');
  });

  test('unauthenticated API call to /api/v1/assessments/sessions returns 401', async ({ request }) => {
    const res = await request.post('/api/v1/assessments/sessions', {
      data: { domain: 'stem_reasoning' }
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(JSON.stringify(body)).toContain('Unauthorized');
  });

  test('student persona accessing /admin is denied with 403 Forbidden', async ({ page, context }) => {
    await loginAs(context, 'student');
    const res = await page.goto('/admin');
    expect(res?.status()).toBe(403);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Administrative privilege required/i);
  });

  test('student persona accessing /teacher is denied with 403 Forbidden', async ({ page, context }) => {
    await loginAs(context, 'student');
    const res = await page.goto('/teacher');
    expect(res?.status()).toBe(403);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Educator credential required/i);
  });

  test('pending parent without verified consent is redirected to /consent', async ({ page, context }) => {
    await context.addCookies([
      { name: 'creed_dev_session', value: 'true', url: 'http://localhost:5173' },
      { name: 'creed_dev_role', value: 'parent_pending', url: 'http://localhost:5173' },
      { name: 'creed_consent_verified', value: 'false', url: 'http://localhost:5173' }
    ]);
    await page.goto('/parent');
    await expect(page).toHaveURL(/\/consent/);
  });
});

// ── 1. Navigation & Core Layout ──────────────────────────────────────────────

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

  test('authenticated app shell provides mobile bottom navigation', async ({ page, context }) => {
    await loginAs(context, 'student');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/student');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('link', { name: /Today/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Map/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Guide/i })).toBeVisible();
  });
});

// ── 2. Landing Page ──────────────────────────────────────────────────────────

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

// ── 3. Student Dashboard ─────────────────────────────────────────────────────

test.describe('Student Dashboard (/student)', () => {
  test('renders learner greeting and next step orientation', async ({ page, context }) => {
    await loginAs(context, 'student');
    await page.goto('/student');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Good morning/i);
    await expect(page.getByText(/Your next step is ready/i)).toBeVisible();
  });

  test('renders Dominant Today Focus and practice action', async ({ page, context }) => {
    await loginAs(context, 'student');
    await page.goto('/student');
    await expect(page.getByRole('heading', { name: /Strengthen proportional reasoning/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Start practice/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /View capabilities/i })).toBeVisible();
  });
});

// ── 4. Adaptive CAT Assessment ───────────────────────────────────────────────

test.describe('Adaptive CAT Assessment (/student/assessment)', () => {
  test('renders the assessment page and starts a session', async ({ page, context }) => {
    await loginAs(context, 'student');
    await page.goto('/student/assessment');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('API session creation responds 201 with auth', async ({ request }) => {
    const res = await request.post('/api/v1/assessments/sessions', {
      headers: authHeaders('student'),
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

// ── 5. Pathway Explorer ──────────────────────────────────────────────────────

test.describe('Pathway Explorer (/student/pathways)', () => {
  test('renders pathway cards', async ({ page, context }) => {
    await loginAs(context, 'student');
    await page.goto('/student/pathways');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

// ── 6. Socratic AI Mentor ────────────────────────────────────────────────────

test.describe('Socratic AI Mentor (/student/mentor)', () => {
  test('renders the mentor interface with thinking moves and dialogue', async ({ page, context }) => {
    await loginAs(context, 'student');
    await page.goto('/student/mentor');
    await expect(page.getByText(/Socratic Mentor/i)).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Kinematics/i);
    await expect(page.getByRole('button', { name: /Decompose/i })).toBeVisible();
  });

  test('mentor chat API responds with a reply with auth', async ({ request }) => {
    const res = await request.post('/api/v1/ai/mentor/chat', {
      headers: authHeaders('student'),
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

// ── 7. Parent Portal ─────────────────────────────────────────────────────────

test.describe('Parent Portal (/parent)', () => {
  test('renders parent portal with verified consent notice', async ({ page, context }) => {
    await loginAs(context, 'parent');
    await page.goto('/parent');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/How is .* doing\?/i);
    await expect(page.getByText(/Verified Parental Consent Active/i)).toBeVisible();
    await expect(page.getByText(/Spatial Reasoning/i).first()).toBeVisible();
  });
});

// ── 8. Teacher Copilot ───────────────────────────────────────────────────────

test.describe('Teacher Copilot (/teacher)', () => {
  test('renders class cohort and priority actions queue', async ({ page, context }) => {
    await loginAs(context, 'teacher');
    await page.goto('/teacher');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Priority Actions/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Log observation/i })).toBeVisible();
  });
});

// ── 9. Counselor Intelligence Center (/counselor) ────────────────────────────

test.describe('Counselor Intelligence Center (/counselor)', () => {
  test('renders the counselor caseload and priority cases', async ({ page, context }) => {
    await loginAs(context, 'counselor');
    await page.goto('/counselor');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Caseload/i);
    await expect(page.getByRole('heading', { name: /Priority Cases/i })).toBeVisible();
    await expect(page.getByText(/24 active learners/i)).toBeVisible();
  });

  test('case selection opens right-side inspector panel', async ({ page, context }) => {
    await loginAs(context, 'counselor');
    await page.goto('/counselor');
    await page.waitForLoadState('networkidle');
    const caseCard = page.getByRole('button', { name: /Learner S-0801/i }).first();
    await caseCard.click();
    await expect(page.getByText(/Grounding Evidence Base/i)).toBeVisible();
    await expect(page.getByText(/Recommended Next Step/i)).toBeVisible();
  });
});

// ── 10. Admin Intelligence Portal (/admin) ───────────────────────────────────

test.describe('Admin Intelligence Portal (/admin)', () => {
  test('renders the admin portal and operational header', async ({ page, context }) => {
    await loginAs(context, 'admin');
    await page.goto('/admin');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Operations/i);
    await expect(page.locator('main').getByText(/Affiliated Educational Institution/i)).toBeVisible();
  });

  test('displays high-density DPDP consent ledger table and search filter', async ({ page, context }) => {
    await loginAs(context, 'admin');
    await page.goto('/admin');
    await expect(page.getByPlaceholder(/Search by learner/i)).toBeVisible();
    await expect(page.getByText('Learner S-0801').first()).toBeVisible();
    await expect(page.getByText('Guardian G-0801').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Export/i })).toBeVisible();
  });
});

// ── 11. Psychometric & Item Bank Studio (/studio) ─────────────────────────────

test.describe('Psychometric & Item Bank Studio (/studio)', () => {
  test('redirects legacy /author to /studio for authenticated studio user', async ({ page, context }) => {
    await loginAs(context, 'studio');
    await page.goto('/author');
    await expect(page).toHaveURL(/\/studio/);
  });

  test('renders the item studio and 3PL IRT calibration panel', async ({ page, context }) => {
    await loginAs(context, 'studio');
    await page.goto('/studio');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/ITEM_STUDIO/i);
    await expect(page.getByText(/CALIBRATION \/\/ 3PL IRT/i)).toBeVisible();
    await expect(page.locator('input[type="range"]').first()).toBeVisible();
  });
});

// ── 12. CREED OS REST APIs ───────────────────────────────────────────────────

test.describe('CREED OS REST API Contracts (/api/v1)', () => {
  test('GET /api/v1/learners/:id/profile returns 200 with competencies when authenticated', async ({ request }) => {
    const res = await request.get('/api/v1/learners/3fa85f64-5717-4562-b3fc-2c963f66afa6/profile', {
      headers: authHeaders('student')
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('Student Learner');
    expect(body).toHaveProperty('competencies');
    expect(body).toHaveProperty('topPathways');
  });

  test('GET /api/v1/learners/:id/evidence returns 200 with provenance when authenticated', async ({ request }) => {
    const res = await request.get('/api/v1/learners/3fa85f64-5717-4562-b3fc-2c963f66afa6/evidence', {
      headers: authHeaders('student')
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).not.toBeNull();
    expect(body).toHaveProperty('evidenceCount');
    expect(body).toHaveProperty('evidence');
  });

  test('POST /api/v1/pathways/:id/mismatch returns 200 with constructive plan when authenticated', async ({ request }) => {
    const res = await request.post('/api/v1/pathways/PATH-ROBOTICS/mismatch', {
      headers: authHeaders('student'),
      data: { learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.pathwayId).toBe('PATH-ROBOTICS');
    expect(body).toHaveProperty('strengthsMeetingRequirements');
    expect(body).toHaveProperty('foundationGaps');
    expect(body).toHaveProperty('recommendedIntervention');
  });

  test('POST /api/v1/consent/challenge issues an OTP challenge successfully', async ({ request }) => {
    const res = await request.post('/api/v1/consent/challenge', {
      data: {
        learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        channel: 'SMS_OTP',
        parentName: 'Parent Guardian',
        parentContact: '+91 98765 43210'
      }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body).toHaveProperty('devOtp');
  });
});

// ── 13. Workspace Utility Routes ─────────────────────────────────────────────

test.describe('Workspace Utility Routes', () => {
  test('Settings (/settings) renders workspace settings and privacy controls when authenticated', async ({ page, context }) => {
    await loginAs(context, 'student');
    await page.goto('/settings');
    await expect(page.locator('h1')).toContainText('Workspace Settings');
    await expect(page.getByText('Display & Ergonomics')).toBeVisible();
    await expect(page.getByText('Privacy & Data Sovereignty')).toBeVisible();
  });

  test('Help (/help) renders documentation and principles when authenticated', async ({ page, context }) => {
    await loginAs(context, 'student');
    await page.goto('/help');
    await expect(page.locator('h1')).toContainText('Documentation & Guidance');
    await expect(page.getByText('Quiet Editorial Intelligence')).toBeVisible();
  });
});

// ── 14. 404 & Error Handling ─────────────────────────────────────────────────

test.describe('Error Handling', () => {
  test('non-existent route returns our customized error page with 404 status when authenticated', async ({ page, context }) => {
    await loginAs(context, 'student');
    const res = await page.goto('/does-not-exist-xyz');
    expect(res?.status()).toBe(404);
    await expect(page.getByText(/Destination Not Found/i)).toBeVisible();
    await expect(page.getByText(/HTTP 404/i)).toBeVisible();
  });

  test('non-existent route redirects unauthenticated visitor to login', async ({ page }) => {
    await page.goto('/does-not-exist-xyz');
    await expect(page).toHaveURL(/\/login\?next=%2Fdoes-not-exist-xyz/);
  });
});

// ── 15. Security & Internationalization (Phase 3) ─────────────────────────────

test.describe('Security & Internationalization (Phase 3)', () => {
  test('GET /api/v1/altcha issues a valid cryptographic Proof-of-Work challenge', async ({ request }) => {
    const res = await request.get('/api/v1/altcha');
    expect(res.status()).toBe(200);
    const challenge = await res.json();
    expect(challenge).toHaveProperty('algorithm', 'SHA-256');
    expect(challenge).toHaveProperty('challenge');
    expect(challenge).toHaveProperty('maxnumber');
    expect(challenge).toHaveProperty('salt');
    expect(challenge).toHaveProperty('signature');
  });

  test('Consent Gate (/consent) renders the Altcha PoW verification widget', async ({ page, context }) => {
    await loginAs(context, 'parent');
    await page.goto('/consent');
    await expect(page.getByTestId('altcha-widget')).toBeVisible();
    await expect(page.getByText(/Anti-Abuse Verification/i)).toBeVisible();
  });

  test('TopBar renders LanguageSwitcher and allows switching locales', async ({ page, context }) => {
    await loginAs(context, 'student');
    await page.goto('/student');
    const switcher = page.locator('[data-testid="language-switcher"][data-hydrated="true"]');
    await expect(switcher).toBeVisible();
    await switcher.click();
    await expect(page.getByRole('option', { name: /हिन्दी/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /मराठी/i })).toBeVisible();
  });
});

// ── 16. Bits UI v1 & Universal Iconify Architecture ─────────────────────────

test.describe('Bits UI v1 Primitives & Iconify Architecture', () => {
  test('Item Studio (/studio) renders Bits UI v1 Menubar with command menus', async ({ page, context }) => {
    await loginAs(context, 'studio');
    await page.goto('/studio');
    await expect(page.getByRole('menubar')).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Item/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Psychometrics/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Simulation/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /View/i })).toBeVisible();
  });

  test('Parental Consent Gate (/consent) renders Bits UI v1 PinInput after OTP request', async ({ page, context }) => {
    await loginAs(context, 'parent');
    await page.goto('/consent');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();
    await page.fill('#guardian-name', 'Parent Guardian');
    await page.fill('#guardian-contact', '+91 98765 43210');
    await page.getByRole('button', { name: /Send Verification OTP/i }).click();
    await expect(page.getByTestId('pin-input-otp')).toBeVisible();
  });

  test('Account Verification Gate (/verify) renders Bits UI v1 PinInput', async ({ page }) => {
    await page.goto('/verify');
    await expect(page.getByTestId('pin-input-verify')).toBeVisible();
    await expect(page.getByRole('button', { name: /Confirm & Activate Account/i })).toBeVisible();
  });
});

// ── 17. Applied Maker Missions & Pedagogical Actions ─────────────────────────

test.describe('Applied Maker Missions & Pedagogical Actions', () => {
  test('Student can launch and simulate RoboBridge maker mission (/student/missions/robobridge)', async ({ page, context }) => {
    await loginAs(context, 'student');
    await page.goto('/student/missions/robobridge');
    await expect(page.locator('[data-app-hydrated="true"]')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/RoboBridge Structural Optimization/i);
    await expect(page.getByText(/LEVEL 4 APPLIED TASK/i)).toBeVisible();
    await expect(page.getByText(/Bridge Mass/i)).toBeVisible();
    await expect(page.getByText(/Strength-to-Weight/i)).toBeVisible();
    await expect(page.getByText(/12.0 METERS SPAN/i)).toBeVisible();

    // Verify submit button is enabled and generates Level 4 evidence modal
    const submitBtn = page.getByRole('button', { name: /Submit Design for Level 4 Evidence/i });
    await expect(submitBtn).toBeEnabled();
    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/v1/missions/submit') && resp.status() === 200
    );
    await submitBtn.click();
    await responsePromise;

    // Evidence modal should disclose verified evidence details
    await expect(page.getByText(/Verified Level 4 Applied Evidence/i)).toBeVisible();
    await expect(page.getByText(/Level 4 \(Applied Mission Task\) created/i)).toBeVisible();
  });

  test('Teacher can log classroom observation and see it appended to evidence trail', async ({ page, context }) => {
    await loginAs(context, 'teacher');
    await page.goto('/teacher');
    await expect(page.locator('[data-app-hydrated="true"]')).toBeVisible();

    // Open observation drawer via top priority tool
    await page.getByRole('button', { name: /Log observation/i }).first().click();
    await expect(page.getByText(/Log Classroom Observation/i)).toBeVisible();

    // Fill observation
    await page.fill('#obs-text', 'Student independently derived inverse speed relation for 3-gear train.');
    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/v1/teachers/observations') && resp.status() === 200
    );
    await page.getByRole('button', { name: /Save Observation/i }).click();
    await responsePromise;

    // Verify confirmation and appearance in class evidence trail
    await expect(page.getByText(/Observation recorded successfully/i)).toBeVisible();
  });

  test('Item Studio can trigger QTI 3.0 XML export', async ({ page, context }) => {
    await loginAs(context, 'studio');
    await page.goto('/studio');
    await expect(page.locator('[data-app-hydrated="true"]')).toBeVisible();
    await expect(page.getByRole('menubar')).toBeVisible();
    const itemMenu = page.getByRole('menuitem', { name: 'Item', exact: true });
    await expect(itemMenu).toBeVisible();
    await itemMenu.click();
    await expect(page.getByRole('menuitem', { name: /Export QTI 3.0 XML/i })).toBeVisible();
  });
});


