import { describe, it, expect } from 'vitest';
import {
  transitionConsentState,
  isConsentActive,
  ConsentStateError,
  type ConsentRecord
} from '../src/consent.js';

describe('DPDP Consent State Machine', () => {
  const baseRecord: ConsentRecord = {
    id: 'rec-001',
    learnerId: 'learner-123',
    parentName: 'Sunita Verma',
    parentContact: '+919876543210',
    verificationChannel: 'SMS_OTP',
    status: 'PENDING_PARENTAL_NOTICE',
    consentVersion: 'v1.0-dpdp',
    purposes: ['COMPETENCY_ASSESSMENT', 'SOCRATIC_MENTORSHIP', 'PATHWAY_NAVIGATION'],
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    immutableAuditHash: '',
    updatedAt: new Date().toISOString()
  };

  it('transitions from PENDING to NOTICE_SENT on SEND_NOTICE', () => {
    const next = transitionConsentState(baseRecord, {
      type: 'SEND_NOTICE',
      sentAt: new Date().toISOString()
    });
    expect(next.status).toBe('NOTICE_SENT');
  });

  it('transitions from NOTICE_SENT to VERIFIED_ACTIVE on valid verification', () => {
    const noticeSent = transitionConsentState(baseRecord, {
      type: 'SEND_NOTICE',
      sentAt: new Date().toISOString()
    });

    const verified = transitionConsentState(noticeSent, {
      type: 'VERIFY_CONSENT',
      channel: 'DIGILOCKER',
      verifiedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      auditToken: 'tok_verified_9912'
    });

    expect(verified.status).toBe('VERIFIED_ACTIVE');
    expect(verified.verificationChannel).toBe('DIGILOCKER');
    expect(verified.immutableAuditHash).toContain('dpdp_');
    expect(isConsentActive(verified)).toBe(true);
  });

  it('freezes processing on WITHDRAW_CONSENT', () => {
    const active: ConsentRecord = {
      ...baseRecord,
      status: 'VERIFIED_ACTIVE',
      verifiedAt: new Date().toISOString()
    };

    const withdrawn = transitionConsentState(active, {
      type: 'WITHDRAW_CONSENT',
      withdrawnAt: new Date().toISOString(),
      reason: 'Parent requested deletion of behavioral telemetry'
    });

    expect(withdrawn.status).toBe('WITHDRAWN');
    expect(withdrawn.withdrawnAt).toBeDefined();
    expect(isConsentActive(withdrawn)).toBe(false);
  });

  it('rejects invalid state transitions with ConsentStateError', () => {
    const active: ConsentRecord = {
      ...baseRecord,
      status: 'VERIFIED_ACTIVE'
    };

    expect(() => {
      transitionConsentState(active, {
        type: 'SEND_NOTICE',
        sentAt: new Date().toISOString()
      });
    }).toThrow(ConsentStateError);
  });
});
