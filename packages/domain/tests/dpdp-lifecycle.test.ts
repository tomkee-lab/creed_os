import { describe, it, expect } from 'vitest';
import {
  transitionConsentState,
  isConsentActive,
  computeAuditHash,
  verifyAuditHash,
  isMinorRequiringConsent,
  advanceErasureStage,
  ConsentStateError,
  type ConsentRecord,
  type AccountErasureRecord
} from '../src/consent.js';

describe('Gate 3 — DPDP Act 2023 Statutory Consent & Lifecycle Testing', () => {
  const baseRecord: ConsentRecord = {
    id: 'cst-test-01',
    learnerId: 'learner-minor-01',
    guardianId: 'parent-auth-01',
    parentName: 'Priya Sharma',
    parentContact: '+91 98765 43210',
    verificationChannel: 'SMS_OTP',
    status: 'PENDING_PARENTAL_NOTICE',
    consentVersion: 'v1.2-dpdp-2023',
    purposes: ['COMPETENCY_ASSESSMENT', 'SOCRATIC_MENTORSHIP', 'PATHWAY_NAVIGATION'],
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    immutableAuditHash: '',
    updatedAt: new Date().toISOString()
  };

  it('verifies statutory minor age threshold under DPDP Act 2023 (< 18 years)', () => {
    const referenceDate = new Date('2026-10-14T00:00:00Z');

    // Exactly 17 years, 364 days old -> Minor requiring consent
    expect(isMinorRequiringConsent('2008-10-15', referenceDate)).toBe(true);

    // Exactly 18 years, 0 days old -> Adult, no parental consent mandatory
    expect(isMinorRequiringConsent('2008-10-14', referenceDate)).toBe(false);

    // 10 years old (Class 5 cohort) -> Minor requiring consent
    expect(isMinorRequiringConsent('2016-05-20', referenceDate)).toBe(true);

    // Invalid date string -> Fails closed to true (protect child)
    expect(isMinorRequiringConsent('invalid-date', referenceDate)).toBe(true);
  });

  it('enforces immutable audit hash computation and cryptographic verification', () => {
    const verifiedAt = new Date().toISOString();
    const token = 'token-otp-secure-99';
    const hash = computeAuditHash('learner-minor-01', token, verifiedAt);

    expect(hash).toMatch(/^dpdp_[0-9a-f]{8}$/);

    const verifiedRecord: ConsentRecord = {
      ...baseRecord,
      status: 'VERIFIED_ACTIVE',
      verifiedAt,
      immutableAuditHash: hash
    };

    // Valid token matches
    expect(verifyAuditHash(verifiedRecord, token)).toBe(true);

    // Tampered token fails
    expect(verifyAuditHash(verifiedRecord, 'forged-token')).toBe(false);
  });

  it('enforces statutory lifecycle transitions: NOTICE_SENT -> VERIFIED_ACTIVE -> WITHDRAWN', () => {
    // 1. Send notice
    const noticeSent = transitionConsentState(baseRecord, {
      type: 'SEND_NOTICE',
      sentAt: new Date().toISOString()
    });
    expect(noticeSent.status).toBe('NOTICE_SENT');
    expect(isConsentActive(noticeSent)).toBe(false);

    // 2. Verify consent
    const verifiedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();
    const verified = transitionConsentState(noticeSent, {
      type: 'VERIFY_CONSENT',
      channel: 'DIGILOCKER',
      verifiedAt,
      expiresAt,
      auditToken: 'digilocker-auth-token-01'
    });
    expect(verified.status).toBe('VERIFIED_ACTIVE');
    expect(isConsentActive(verified)).toBe(true);
    expect(verified.verificationChannel).toBe('DIGILOCKER');
    expect(verified.immutableAuditHash).toBeTruthy();

    // 3. Withdraw consent
    const withdrawn = transitionConsentState(verified, {
      type: 'WITHDRAW_CONSENT',
      withdrawnAt: new Date().toISOString(),
      reason: 'Guardian revoked consent under DPDP Section 9'
    });
    expect(withdrawn.status).toBe('WITHDRAWN');
    expect(isConsentActive(withdrawn)).toBe(false);

    // 4. Illegal transition: cannot renew withdrawn consent without re-verification
    expect(() =>
      transitionConsentState(withdrawn, {
        type: 'RENEW_CONSENT',
        expiresAt: new Date().toISOString(),
        renewedAt: new Date().toISOString()
      })
    ).toThrow(ConsentStateError);
  });

  it('enforces 6-tier account erasure state progression', () => {
    const now = new Date().toISOString();
    const initialErasure: AccountErasureRecord = {
      learnerId: 'learner-minor-01',
      stage: 'IDLE',
      requestedAt: now,
      gracePeriodExpiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      immutableAuditLog: ['Initialized erasure audit record']
    };

    // Tier 1: Request erasure
    const requested = advanceErasureStage(initialErasure, 'ERASURE_REQUESTED');
    expect(requested.stage).toBe('ERASURE_REQUESTED');

    // Tier 2: Grace period active
    const grace = advanceErasureStage(requested, 'GRACE_PERIOD_ACTIVE');
    expect(grace.stage).toBe('GRACE_PERIOD_ACTIVE');

    // Tier 3: Active record purged
    const activePurged = advanceErasureStage(grace, 'ACTIVE_RECORD_PURGED');
    expect(activePurged.stage).toBe('ACTIVE_RECORD_PURGED');
    expect(activePurged.activePurgedAt).toBeTruthy();

    // Tier 4: Derived psychometrics purged
    const derivedPurged = advanceErasureStage(activePurged, 'DERIVED_PROFILE_PURGED');
    expect(derivedPurged.stage).toBe('DERIVED_PROFILE_PURGED');
    expect(derivedPurged.derivedPurgedAt).toBeTruthy();

    // Tier 5: Edge cache purged
    const cachePurged = advanceErasureStage(derivedPurged, 'EDGE_CACHE_PURGED');
    expect(cachePurged.stage).toBe('EDGE_CACHE_PURGED');
    expect(cachePurged.cachePurgedAt).toBeTruthy();

    // Tier 6: Rolling archive backup purged
    const finalPurged = advanceErasureStage(cachePurged, 'ARCHIVED_LOG_PURGED');
    expect(finalPurged.stage).toBe('ARCHIVED_LOG_PURGED');
    expect(finalPurged.backupPurgedAt).toBeTruthy();
    expect(finalPurged.immutableAuditLog.length).toBe(7);

    // Illegal rollback from ARCHIVED_LOG_PURGED
    expect(() => advanceErasureStage(finalPurged, 'IDLE')).toThrow(ConsentStateError);
  });
});
