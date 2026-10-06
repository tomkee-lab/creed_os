export type UserRole =
  | 'student'
  | 'parent'
  | 'teacher'
  | 'counselor'
  | 'institute_staff'
  | 'institute_admin'
  | 'platform_admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: 'school' | 'coaching_institute' | 'academy' | 'district';
  frameworkPreference: string;
  createdAt: string;
}

export interface OrganizationMembership {
  id: string;
  organizationId: string;
  userId: string;
  role: UserRole;
  createdAt: string;
}

export interface ParentLearnerLink {
  id: string;
  parentId: string;
  learnerId: string;
  relationship: 'father' | 'mother' | 'legal_guardian';
  consentStatus: 'pending' | 'verified' | 'withdrawn' | 'expired';
  verifiedAt?: string;
  createdAt: string;
}
