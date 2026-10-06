/**
 * DPDP Act Compliance & Parental Consent State Machine
 *
 * Implements statutory consent state transitions, verifiable audit trails,
 * and data freeze enforcement for minors (Ages 10–16 / Classes 5–10).
 */

export type ConsentStatus =
  | 'PENDING_PARENTAL_NOTICE'
  | 'NOTICE_SENT'
  | 'VERIFIED_ACTIVE'
  | 'WITHDRAWN'
  | 'EXPIRED';

export type VerificationChannel = 'DIGILOCKER' | 'SMS_OTP' | 'EMAIL_VERIFICATION' | 'IN_PERSON_SIGNATURE';

export interface ConsentRecord {
  id: string;
  learnerId: string;
  parentName: string;
  parentContact: string; // Phone or Email
  verificationChannel: VerificationChannel;
  status: ConsentStatus;
  consentVersion: string; // e.g. "v1.2-dpdp-2023"
  purposes: Array<'COMPETENCY_ASSESSMENT' | 'SOCRATIC_MENTORSHIP' | 'PATHWAY_NAVIGATION'>;
  verifiedAt?: string;
  expiresAt: string;
  withdrawnAt?: string;
  immutableAuditHash: string;
  updatedAt: string;
}

export type ConsentTransitionEvent =
  | { type: 'SEND_NOTICE'; sentAt: string }
  | { type: 'VERIFY_CONSENT'; channel: VerificationChannel; verifiedAt: string; expiresAt: string; auditToken: string }
  | { type: 'WITHDRAW_CONSENT'; withdrawnAt: string; reason: string }
  | { type: 'EXPIRE_CONSENT'; expiredAt: string }
  | { type: 'RENEW_CONSENT'; expiresAt: string; renewedAt: string };

export class ConsentStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConsentStateError';
  }
}

/**
 * Deterministic transition function for DPDP consent lifecycle.
 * Throws ConsentStateError if an illegal transition is attempted.
 */
export function transitionConsentState(
  currentRecord: ConsentRecord,
  event: ConsentTransitionEvent
): ConsentRecord {
  const updated: ConsentRecord = {
    ...currentRecord,
    updatedAt: new Date().toISOString()
  };

  switch (currentRecord.status) {
    case 'PENDING_PARENTAL_NOTICE':
      if (event.type === 'SEND_NOTICE') {
        updated.status = 'NOTICE_SENT';
        return updated;
      }
      if (event.type === 'VERIFY_CONSENT') {
        // Fast-path verification when parent authenticates directly
        updated.status = 'VERIFIED_ACTIVE';
        updated.verificationChannel = event.channel;
        updated.verifiedAt = event.verifiedAt;
        updated.expiresAt = event.expiresAt;
        updated.immutableAuditHash = computeAuditHash(currentRecord.learnerId, event.auditToken, event.verifiedAt);
        return updated;
      }
      throw new ConsentStateError(
        `Invalid event ${event.type} for status ${currentRecord.status}. Must send notice or verify.`
      );

    case 'NOTICE_SENT':
      if (event.type === 'VERIFY_CONSENT') {
        updated.status = 'VERIFIED_ACTIVE';
        updated.verificationChannel = event.channel;
        updated.verifiedAt = event.verifiedAt;
        updated.expiresAt = event.expiresAt;
        updated.immutableAuditHash = computeAuditHash(currentRecord.learnerId, event.auditToken, event.verifiedAt);
        return updated;
      }
      if (event.type === 'EXPIRE_CONSENT') {
        updated.status = 'EXPIRED';
        return updated;
      }
      throw new ConsentStateError(
        `Cannot transition from NOTICE_SENT using ${event.type}. Expecting VERIFY_CONSENT or EXPIRE_CONSENT.`
      );

    case 'VERIFIED_ACTIVE':
      if (event.type === 'WITHDRAW_CONSENT') {
        updated.status = 'WITHDRAWN';
        updated.withdrawnAt = event.withdrawnAt;
        return updated;
      }
      if (event.type === 'EXPIRE_CONSENT') {
        updated.status = 'EXPIRED';
        return updated;
      }
      if (event.type === 'RENEW_CONSENT') {
        updated.expiresAt = event.expiresAt;
        return updated;
      }
      throw new ConsentStateError(
        `Cannot transition active consent using ${event.type}. Permitted: WITHDRAW_CONSENT, EXPIRE_CONSENT, RENEW_CONSENT.`
      );

    case 'WITHDRAWN':
      // Under DPDP, once withdrawn, a new consent lifecycle must be explicitly started
      if (event.type === 'VERIFY_CONSENT') {
        updated.status = 'VERIFIED_ACTIVE';
        updated.verificationChannel = event.channel;
        updated.verifiedAt = event.verifiedAt;
        updated.expiresAt = event.expiresAt;
        updated.withdrawnAt = undefined;
        updated.immutableAuditHash = computeAuditHash(currentRecord.learnerId, event.auditToken, event.verifiedAt);
        return updated;
      }
      throw new ConsentStateError(
        `Consent has been withdrawn. Processing is frozen. Must re-verify with new parental authorization.`
      );

    case 'EXPIRED':
      if (event.type === 'RENEW_CONSENT' || event.type === 'VERIFY_CONSENT') {
        updated.status = 'VERIFIED_ACTIVE';
        if (event.type === 'VERIFY_CONSENT') {
          updated.verificationChannel = event.channel;
          updated.verifiedAt = event.verifiedAt;
        }
        updated.expiresAt = event.expiresAt;
        return updated;
      }
      throw new ConsentStateError(`Expired consent requires RENEW_CONSENT or VERIFY_CONSENT.`);

    default:
      throw new ConsentStateError(`Unknown consent status: ${(currentRecord as any).status}`);
  }
}

/**
 * Asserts whether learner data can be processed for profiling or AI mentorship.
 */
export function isConsentActive(record: ConsentRecord): boolean {
  if (record.status !== 'VERIFIED_ACTIVE') return false;
  if (!record.expiresAt) return false;
  const now = new Date().getTime();
  const expiry = new Date(record.expiresAt).getTime();
  return now < expiry;
}

function computeAuditHash(learnerId: string, token: string, timestamp: string): string {
  // Deterministic pseudo-hash string for local verification audit trail
  let hash = 0;
  const str = `${learnerId}:${token}:${timestamp}:DPDP-ACT-2023`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `dpdp_${Math.abs(hash).toString(16).padStart(8, '0')}`;
}
