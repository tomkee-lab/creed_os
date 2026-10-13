import { describe, it, expect } from 'vitest';
import {
  isDevBypassPermitted,
  canAccessLearnerData,
  validateConsentGating,
  type SecurityActor
} from '../src/security.js';
import {
  transitionConsentState,
  isConsentActive,
  ConsentStateError,
  type ConsentRecord
} from '../src/consent.js';

describe('Security & Child-Safety Verification: Negative Test Suite', () => {
  describe('1. Dev Session Cookie & Loopback Gating', () => {
    it('rejects dev persona bypass in production mode regardless of hostname', () => {
      const prodLocalhost = isDevBypassPermitted({ isDev: false, hostname: 'localhost' });
      const prodLoopback = isDevBypassPermitted({ isDev: false, hostname: '127.0.0.1' });
      const prodDomain = isDevBypassPermitted({ isDev: false, hostname: 'creed-os.app' });

      expect(prodLocalhost).toBe(false);
      expect(prodLoopback).toBe(false);
      expect(prodDomain).toBe(false);
    });

    it('rejects dev persona bypass in dev mode on non-loopback hostnames', () => {
      const lanHost = isDevBypassPermitted({ isDev: true, hostname: '192.168.1.42' });
      const publicHost = isDevBypassPermitted({ isDev: true, hostname: 'staging.creed-os.app' });
      const wildcardHost = isDevBypassPermitted({ isDev: true, hostname: '0.0.0.0' });
      const spoofedHost = isDevBypassPermitted({ isDev: true, hostname: 'not-localhost.internal' });

      expect(lanHost).toBe(false);
      expect(publicHost).toBe(false);
      expect(wildcardHost).toBe(false);
      expect(spoofedHost).toBe(false);
    });

    it('permits dev persona bypass strictly on loopback interfaces in dev mode', () => {
      expect(isDevBypassPermitted({ isDev: true, hostname: 'localhost' })).toBe(true);
      expect(isDevBypassPermitted({ isDev: true, hostname: '127.0.0.1' })).toBe(true);
    });
  });

  describe('2. Client Cookie Cannot Bypass Authoritative Database Consent', () => {
    it('rejects access when creed_consent_verified cookie is present but no server record exists', () => {
      const evaluation = validateConsentGating(null, 'true');
      expect(evaluation.allowed).toBe(false);
      expect(evaluation.violation).toBe('CONSENT_PENDING');
    });

    it('rejects access when creed_consent_verified cookie is present but consent is WITHDRAWN', () => {
      const withdrawnRecord: ConsentRecord = {
        id: 'cst-withdrawn',
        learnerId: 'learner-001',
        parentName: 'Jane Doe',
        parentContact: '+91 98765 00000',
        verificationChannel: 'SMS_OTP',
        status: 'WITHDRAWN',
        consentVersion: 'v1.2-dpdp-2023',
        purposes: ['COMPETENCY_ASSESSMENT'],
        withdrawnAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 100000).toISOString(),
        immutableAuditHash: 'dpdp_withdrawn_hash',
        updatedAt: new Date().toISOString()
      };

      const evaluation = validateConsentGating(withdrawnRecord, 'true');
      expect(evaluation.allowed).toBe(false);
      expect(evaluation.violation).toBe('CONSENT_WITHDRAWN');
    });

    it('rejects access when creed_consent_verified cookie is present but consent is EXPIRED', () => {
      const expiredRecord: ConsentRecord = {
        id: 'cst-expired',
        learnerId: 'learner-002',
        parentName: 'John Doe',
        parentContact: '+91 98765 11111',
        verificationChannel: 'DIGILOCKER',
        status: 'EXPIRED',
        consentVersion: 'v1.2-dpdp-2023',
        purposes: ['COMPETENCY_ASSESSMENT'],
        expiresAt: new Date(Date.now() - 60000).toISOString(),
        immutableAuditHash: 'dpdp_expired_hash',
        updatedAt: new Date().toISOString()
      };

      const evaluation = validateConsentGating(expiredRecord, 'true');
      expect(evaluation.allowed).toBe(false);
      expect(evaluation.violation).toBe('CONSENT_EXPIRED');
    });

    it('rejects access when record is marked VERIFIED_ACTIVE but timestamp is in the past', () => {
      const pastRecord: ConsentRecord = {
        id: 'cst-stale',
        learnerId: 'learner-003',
        parentName: 'Sam Doe',
        parentContact: '+91 98765 22222',
        verificationChannel: 'DIGILOCKER',
        status: 'VERIFIED_ACTIVE',
        consentVersion: 'v1.2-dpdp-2023',
        purposes: ['COMPETENCY_ASSESSMENT'],
        expiresAt: new Date(Date.now() - 1000).toISOString(), // 1 second ago
        immutableAuditHash: 'dpdp_stale_hash',
        updatedAt: new Date().toISOString()
      };

      const evaluation = validateConsentGating(pastRecord, 'true');
      expect(evaluation.allowed).toBe(false);
      expect(evaluation.violation).toBe('CONSENT_EXPIRED');
    });

    it('permits access only when authoritative record is VERIFIED_ACTIVE and not expired', () => {
      const activeRecord: ConsentRecord = {
        id: 'cst-active',
        learnerId: 'learner-004',
        parentName: 'Alex Doe',
        parentContact: '+91 98765 33333',
        verificationChannel: 'DIGILOCKER',
        status: 'VERIFIED_ACTIVE',
        consentVersion: 'v1.2-dpdp-2023',
        purposes: ['COMPETENCY_ASSESSMENT'],
        verifiedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        immutableAuditHash: 'dpdp_active_hash',
        updatedAt: new Date().toISOString()
      };

      const evaluation = validateConsentGating(activeRecord, 'true');
      expect(evaluation.allowed).toBe(true);
      expect(isConsentActive(activeRecord)).toBe(true);
    });
  });

  describe('3. Revoked & Expired Consent Lifecycle Hardening', () => {
    it('prevents illegal transitions from WITHDRAWN directly to NOTICE_SENT', () => {
      const withdrawnRecord: ConsentRecord = {
        id: 'cst-revoked',
        learnerId: 'learner-005',
        parentName: 'Guardian',
        parentContact: '+91 98765 44444',
        verificationChannel: 'SMS_OTP',
        status: 'WITHDRAWN',
        consentVersion: 'v1.2-dpdp-2023',
        purposes: ['COMPETENCY_ASSESSMENT'],
        withdrawnAt: new Date().toISOString(),
        expiresAt: new Date().toISOString(),
        immutableAuditHash: 'hash',
        updatedAt: new Date().toISOString()
      };

      expect(() => {
        transitionConsentState(withdrawnRecord, {
          type: 'SEND_NOTICE',
          sentAt: new Date().toISOString()
        });
      }).toThrow(ConsentStateError);
    });

    it('requires re-verification token to reactivate withdrawn consent', () => {
      const withdrawnRecord: ConsentRecord = {
        id: 'cst-revoked',
        learnerId: 'learner-006',
        parentName: 'Guardian',
        parentContact: '+91 98765 44444',
        verificationChannel: 'SMS_OTP',
        status: 'WITHDRAWN',
        consentVersion: 'v1.2-dpdp-2023',
        purposes: ['COMPETENCY_ASSESSMENT'],
        withdrawnAt: new Date().toISOString(),
        expiresAt: new Date().toISOString(),
        immutableAuditHash: 'hash',
        updatedAt: new Date().toISOString()
      };

      const reactivated = transitionConsentState(withdrawnRecord, {
        type: 'VERIFY_CONSENT',
        channel: 'SMS_OTP',
        verifiedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        auditToken: '987654'
      });

      expect(reactivated.status).toBe('VERIFIED_ACTIVE');
      expect(isConsentActive(reactivated)).toBe(true);
      expect(reactivated.immutableAuditHash).toContain('dpdp_');
    });
  });

  describe('4. Relationship-Scoped Access & Cross-Tenant Boundary Tests', () => {
    it('denies student access to another student learner profile', () => {
      const studentActor: SecurityActor = {
        id: 'student-A',
        role: 'student'
      };

      const result = canAccessLearnerData(studentActor, 'student-B');
      expect(result.allowed).toBe(false);
      expect(result.violation).toBe('UNAUTHORIZED_LEARNER_ACCESS');
    });

    it('permits student access to their own learner profile', () => {
      const studentActor: SecurityActor = {
        id: 'student-A',
        role: 'student'
      };

      const result = canAccessLearnerData(studentActor, 'student-A');
      expect(result.allowed).toBe(true);
    });

    it('denies guardian access to a non-linked child learner profile', () => {
      const parentActor: SecurityActor = {
        id: 'parent-001',
        role: 'parent',
        linkedLearnerIds: ['child-A']
      };

      const result = canAccessLearnerData(parentActor, 'child-B');
      expect(result.allowed).toBe(false);
      expect(result.violation).toBe('UNAUTHORIZED_LEARNER_ACCESS');
    });

    it('permits guardian access to their verified linked child profile', () => {
      const parentActor: SecurityActor = {
        id: 'parent-001',
        role: 'parent',
        linkedLearnerIds: ['child-A']
      };

      const result = canAccessLearnerData(parentActor, 'child-A');
      expect(result.allowed).toBe(true);
    });

    it('denies cross-tenant staff access when organization boundaries differ', () => {
      const educatorActor: SecurityActor = {
        id: 'teacher-001',
        role: 'teacher',
        organizationId: 'school-delhi-01'
      };

      const result = canAccessLearnerData(educatorActor, 'learner-mumbai-01', 'school-mumbai-02');
      expect(result.allowed).toBe(false);
      expect(result.violation).toBe('CROSS_TENANT_ACCESS_DENIED');
    });

    it('permits institutional educator access within the same tenant organization', () => {
      const educatorActor: SecurityActor = {
        id: 'teacher-001',
        role: 'teacher',
        organizationId: 'school-delhi-01'
      };

      const result = canAccessLearnerData(educatorActor, 'learner-delhi-01', 'school-delhi-01');
      expect(result.allowed).toBe(true);
    });
  });
});
