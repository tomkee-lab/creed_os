import type { ConsentRecord } from './consent.js';
import { isConsentActive } from './consent.js';

export type SecurityViolationCode =
  | 'DEV_BYPASS_DISALLOWED'
  | 'COOKIE_FORGERY_DETECTED'
  | 'CONSENT_EXPIRED'
  | 'CONSENT_WITHDRAWN'
  | 'CONSENT_PENDING'
  | 'UNAUTHORIZED_LEARNER_ACCESS'
  | 'CROSS_TENANT_ACCESS_DENIED';

export interface SecurityEvaluationResult {
  allowed: boolean;
  violation?: SecurityViolationCode;
  reason?: string;
}

export interface SecurityActor {
  id: string;
  role: 'student' | 'parent' | 'teacher' | 'counselor' | 'admin' | 'studio' | string;
  linkedLearnerIds?: string[];
  organizationId?: string;
}

/**
 * Asserts whether development persona session bypass is legally and architecturally permitted.
 * In accordance with CREED OS security governance:
 * - Must be strictly running in local development mode (isDev === true).
 * - Must be strictly bound to loopback interfaces (localhost or 127.0.0.1).
 * Production environments, staging domains, and external network hostnames MUST reject dev cookies unconditionally.
 */
export function isDevBypassPermitted(env: { isDev: boolean; hostname: string }): boolean {
  if (!env.isDev) {
    return false;
  }
  const cleanHost = (env.hostname || '').toLowerCase().trim();
  return cleanHost === 'localhost' || cleanHost === '127.0.0.1';
}

/**
 * Relationship-scoped access control evaluator under DPDP Act 2023.
 * Enforces strict isolation:
 * - Students may ONLY access their own learner record.
 * - Guardians may ONLY access verified, linked child learner records.
 * - Educators and Counselors are bounded by institutional organization boundaries.
 * - Cross-tenant and cross-learner access attempts are blocked.
 */
export function canAccessLearnerData(
  actor: SecurityActor,
  targetLearnerId: string,
  targetOrganizationId?: string
): SecurityEvaluationResult {
  if (!actor || !actor.id || !actor.role) {
    return {
      allowed: false,
      violation: 'UNAUTHORIZED_LEARNER_ACCESS',
      reason: 'Missing or unauthenticated actor identity'
    };
  }

  // Cross-tenant boundary check
  if (targetOrganizationId && actor.organizationId && actor.organizationId !== targetOrganizationId) {
    return {
      allowed: false,
      violation: 'CROSS_TENANT_ACCESS_DENIED',
      reason: 'Cross-tenant boundary breach: actor organization does not match resource tenant'
    };
  }

  // Student role: self-only isolation
  if (actor.role === 'student') {
    if (actor.id !== targetLearnerId) {
      return {
        allowed: false,
        violation: 'UNAUTHORIZED_LEARNER_ACCESS',
        reason: 'Students are strictly restricted to their own learner profile and diagnostic evidence'
      };
    }
    return { allowed: true };
  }

  // Parent / Guardian role: linked-child-only isolation
  if (actor.role === 'parent' || actor.role === 'parent_pending') {
    const linked = actor.linkedLearnerIds || [];
    if (!linked.includes(targetLearnerId)) {
      return {
        allowed: false,
        violation: 'UNAUTHORIZED_LEARNER_ACCESS',
        reason: 'Guardians are strictly restricted to authorized, verified child learner profiles'
      };
    }
    return { allowed: true };
  }

  // Staff roles (teacher, counselor, admin, studio)
  if (['teacher', 'counselor', 'admin', 'studio'].includes(actor.role)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    violation: 'UNAUTHORIZED_LEARNER_ACCESS',
    reason: `Unrecognized or unauthorized role: ${actor.role}`
  };
}

/**
 * Authoritative DPDP Consent Gating Validator.
 * Critical Security Principle: Client cookies (e.g. creed_consent_verified=true)
 * have ZERO authority to grant access. The authoritative database/server consent
 * record is the sole source of truth.
 *
 * Rejects requests if:
 * 1. No consent record exists (PENDING)
 * 2. Consent record has been withdrawn
 * 3. Consent record has expired
 * 4. Record status is not VERIFIED_ACTIVE
 */
export function validateConsentGating(
  record: ConsentRecord | null | undefined,
  _presentedCookieValue?: string
): SecurityEvaluationResult {
  if (!record) {
    return {
      allowed: false,
      violation: 'CONSENT_PENDING',
      reason: 'Statutory DPDP consent notice has not been verified for this minor learner'
    };
  }

  if (record.status === 'WITHDRAWN') {
    return {
      allowed: false,
      violation: 'CONSENT_WITHDRAWN',
      reason: 'Statutory DPDP consent has been withdrawn by guardian; processing and diagnostics are frozen'
    };
  }

  if (record.status === 'EXPIRED') {
    return {
      allowed: false,
      violation: 'CONSENT_EXPIRED',
      reason: 'Statutory DPDP consent period has expired; re-authorization required'
    };
  }

  if (!isConsentActive(record)) {
    return {
      allowed: false,
      violation: 'CONSENT_EXPIRED',
      reason: 'Statutory consent record is not actively verified or has passed its expiration timestamp'
    };
  }

  return { allowed: true };
}
