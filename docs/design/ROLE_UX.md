# WAY 2.1 — Role UX & Cognitive Jobs

Every screen in CREED OS must answer:
1. **Where am I?**
2. **What matters now?**
3. **What does this mean?**
4. **What should I do next?**
5. **Why should I trust this?**

---

### Role Specifications

| Role | Cognitive Job | Primary Signal | Target Time to Action | Density Mode | Primary Vocabulary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Student** | *Orient me & guide my next discovery* | Dominant **Today's Focus** action | $\le 5$ seconds | Comfortable (60% content / 40% whitespace) | Strengths, Next Focus, Missions, Capabilities, Socratic Guide |
| **Parent** | *Reassure me & suggest home collaboration* | Reassuring summary: *"Anaya is developing well"* | $\le 10$ seconds | Comfortable | Strengths, Growing areas, Home challenge, Shared horizon |
| **Teacher** | *Triage interventions & assign scaffolding* | Prioritized **Needs Attention** queue | $\le 10$ seconds | Comfortable | Misconception clusters, Differentiated exercise, Active roster |
| **Counselor** | *Manage caseload & resolve pathway conflicts* | Prioritized Case Table with Review Dates | $\le 2$ clicks to evidence | Compact | Priority rank, Case context, Recommended action, 3-way dialogue |
| **Admin** | *Govern institutional rosters, consent & security* | Dense searchable data table & Audit Timeline | $\le 15$ seconds | Compact / Dense (75% content / 25% whitespace) | DPDP Consent state, Roster, Verification status, Audit trail |
| **Item Studio** | *Calibrate mathematical item bank parameters* | Parameter controls ($a, b, c$) & Fisher Info Curve | Fast, keyboard-first | High-Density Console | 3PL IRT, Fisher Information, Latent Ability $\theta$, Standard Error $SE$ |

---

### Strict Leak Quarantine Rules
1. **Never leak Studio or Admin terms into Student or Parent routes:**
   - Prohibited terms: $\theta$, $SE$, $3PL$, $a/b/c$, Fisher Information, latent ability, item calibration, Gauss-Hermite quadrature, Evaluator Inspector.
2. **Never display pseudo-precision percentages:**
   - Prohibited: *"74% Readiness"*, *"82% Fit"*, *"94% Alignment"*.
   - Required: *"Strong Foundation (4 / 6 Demonstrated)"*, *"Developing Foundation"*, *"Explore Further"*.
3. **Never render Development Chrome in Production:**
   - The DEV role switcher pill must only mount when `import.meta.env.DEV` is true.
