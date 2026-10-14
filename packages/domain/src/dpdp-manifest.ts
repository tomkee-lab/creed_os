/**
 * CREED OS — DPDP Act 2023 Statutory Manifest & Compliance Specifications
 *
 * Implements legal mandates under the Digital Personal Data Protection Act (DPDP Act) 2023:
 * - Section 5: Notice requirements prior to or at the time of consent request.
 * - Section 6: Specific, informed, unconditional, and unambiguous consent.
 * - Section 9: Processing of personal data of children (mandatory verifiable parental consent < 18 years).
 * - Section 12: Right to correction and erasure of personal data.
 * - Section 13: Right of grievance redressal.
 */

export interface DpdpStatutoryNotice {
  policyVersion: string;
  effectiveDate: string;
  dataFiduciaryName: string;
  dataProtectionOfficer: {
    name: string;
    email: string;
    postalAddress: string;
  };
  purposes: Array<{
    code: string;
    title: string;
    statutoryJustification: string;
    dataCategoriesCollected: string[];
    retentionPeriodDays: number;
  }>;
  childProtectionNotice: {
    statutoryAgeLimit: number; // 18 years
    prohibitedPractices: string[];
    parentalRights: string[];
  };
}

export const CANONICAL_DPDP_NOTICE: DpdpStatutoryNotice = {
  policyVersion: '2026.1-DPDP-STATUTORY',
  effectiveDate: '2026-10-14T00:00:00Z',
  dataFiduciaryName: 'CREED OS Education Foundation Private Limited',
  dataProtectionOfficer: {
    name: 'Adv. Aditi Deshmukh',
    email: 'dpo@creed-os.app',
    postalAddress: 'Compliance Wing, Tech Hub, Outer Ring Road, Bengaluru, Karnataka 560103, India'
  },
  purposes: [
    {
      code: 'COMPETENCY_ASSESSMENT',
      title: 'Computerized Adaptive Diagnostic Assessment',
      statutoryJustification: 'To evaluate learning foundations and determine pedagogical readiness in STEM, AI, and Robotics.',
      dataCategoriesCollected: ['Assessment responses', 'Time-to-response telemetry', 'IRT estimated theta'],
      retentionPeriodDays: 365
    },
    {
      code: 'SOCRATIC_MENTORSHIP',
      title: 'Real-Time Socratic Dialogue & Guidance',
      statutoryJustification: 'To provide immediate pedagogical feedback during interactive laboratory exercises.',
      dataCategoriesCollected: ['Voice stream audio transcripts', 'Code execution logs'],
      retentionPeriodDays: 90
    },
    {
      code: 'PATHWAY_NAVIGATION',
      title: 'Educational & Skill Pathway Mapping',
      statutoryJustification: 'To identify construct matches and scaffolding opportunities across Singapore Full SBB and CBSE tiers.',
      dataCategoriesCollected: ['Subject competencies', 'Cohort percentiles (gated)'],
      retentionPeriodDays: 730
    }
  ],
  childProtectionNotice: {
    statutoryAgeLimit: 18,
    prohibitedPractices: [
      'No behavioral tracking or targeted advertising directed at minors under 18 years.',
      'No deterministic IQ scores, fixed permanent talent categorization, or career exclusion labels.',
      'No cross-tenant data sharing without explicit verifiable guardian authorization.',
      'No processing of minor data causing any detrimental effect on the well-being of a child (Section 9(2)).'
    ],
    parentalRights: [
      'Right to inspect and receive summary of all personal data and processing history.',
      'Right to withdraw consent at any time, terminating all real-time processing within 2 seconds.',
      'Right to request immediate account and data erasure across active and derived stores.',
      'Right to nominate an alternative guardian for data rights in case of death or incapacity.'
    ]
  }
};
