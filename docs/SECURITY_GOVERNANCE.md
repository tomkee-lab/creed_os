# Core_OS — Security, Privacy & Child Safety Governance

**Document Version:** 1.0.0  
**Status:** Mandatory Security Baseline  
**Audience:** Security Engineers, Compliance Officers, Legal Counsel, Developers  

---

## 1. Regulatory Context: India DPDP Act & Global Standards

Because Core_OS serves minors (Ages 10–16), child safety and privacy are fundamental architectural requirements:

- **India DPDP Act (2023):**
  - Section 9 mandates verifiable parental consent prior to processing children's personal data.
  - Absolute statutory prohibition on targeted advertising or behavioral tracking aimed at children.
  - Prohibition on processing data that could cause detrimental effects on a child's mental or physical well-being.
- **COPPA & GDPR-K Alignment:**
  - Data minimization, zero retention of unneeded biometric or raw voice telemetry, and clear data export/deletion workflows.

---

## 2. Verifiable Parental Consent State Machine

Parental authorization is an enforceable database state machine:

```text
       Account Creation (Minor Detected)
                       │
                       ▼
             ┌──────────────────┐
             │     Pending      │ ◄── Verification link / OTP sent to Parent
             └─────────┬────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌──────────────────┐        ┌──────────────────┐
│     Verified     │        │     Expired      │ (After 72 hrs unverified)
└────────┬─────────┘        └──────────────────┘
         │
         ├─── Guardian revokes permission in Parent Portal
         ▼
┌──────────────────┐
│    Withdrawn     │ ──► Triggers immediate anonymization & access revocation
└──────────────────┘
```

### Table: `consents`
```sql
create table consents (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  guardian_id uuid not null references profiles(id),
  consent_type text not null,       -- 'account_creation', 'assessment_participation', 'voice_mentor', 'institution_sharing'
  status text not null default 'pending' check (status in ('pending', 'verified', 'withdrawn', 'expired')),
  verification_method text not null, -- 'sms_otp', 'email_link', 'digilocker_verification', 'aadhaar_auth'
  ip_address inet,
  policy_version text not null,
  verified_at timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now()
);
```

---

## 3. Database Row Level Security (RLS) Model

Every database query runs under RLS context:

1. **Learner Scoping:**
   ```sql
   create policy learner_read_own_profile on profiles
     for select using (auth.uid() = id);
   ```
2. **Parent Relationship Gating:**
   Parents may ONLY access data for minors where a verified link exists:
   ```sql
   create policy parent_read_child_evidence on learner_evidence
     for select using (
       exists (
         select 1 from parent_learner_links pll
         join consents c on c.learner_id = pll.learner_id and c.guardian_id = pll.parent_id
         where pll.parent_id = auth.uid()
           and pll.learner_id = learner_evidence.learner_id
           and c.status = 'verified'
       )
     );
   ```
3. **Teacher Scoping:**
   Teachers can only view learners enrolled in their active class sections, and can NEVER inspect private family notes or unshared home reflections.

---

## 4. Protection Against Token Enumeration

Assessment sessions and parent invitation tokens are vulnerable to brute-force enumeration if exposed through standard sequential IDs or unconstrained public tables.
- All tokens are generated with cryptographic entropy (`gen_random_uuid()` or 256-bit crypto hashes).
- Token verification is executed exclusively inside `SECURITY DEFINER` stored procedures with rate limiting and exponential backoff.

---

## 5. Ephemeral Voice Telemetry (Gemini Live)

For the Socratic Voice Mentor:
1. **No Permanent Audio Retention:** Audio streams are processed ephemerally in volatile memory to generate text transcripts and structured reflection observations.
2. **Audio Purge:** Raw audio buffers are deleted immediately upon utterance processing. Only the sanitized textual observation and the derived evidence atom are retained in the database.
3. **Parental Opt-in:** Voice interaction requires an explicit `voice_mentor` consent record verified by the guardian.

---

## 6. Prohibited AI Outputs & Safety Guardrails

The Core_OS AI gateway strictly suppresses and rejects any model generation containing:
- Fixed IQ scores or single-number intelligence assessments.
- Definitive psychological, psychiatric, or cognitive disability labeling.
- Career exclusion statements (e.g., *"You do not have the brain for engineering"*).
- Direct answer dumping on homework or active assessment items.
