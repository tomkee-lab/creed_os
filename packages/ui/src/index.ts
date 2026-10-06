import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type AudienceRole = 'student' | 'parent' | 'teacher' | 'counselor' | 'admin' | 'studio';

export interface MetricBand {
  min: number;
  max: number;
  label: string;
  studentLabel: string;
  parentLabel: string;
  colorClass: string;
}

export const COMPETENCY_BANDS: MetricBand[] = [
  {
    min: 1.0,
    max: 2.4,
    label: 'Developing',
    studentLabel: 'Next Focus',
    parentLabel: 'Developing Foundation',
    colorClass: 'text-(--accent-warning) bg-(--accent-warning-subtle) border border-(--border-subtle)'
  },
  {
    min: 2.5,
    max: 3.4,
    label: 'Expected',
    studentLabel: 'On Track',
    parentLabel: 'Age Expected',
    colorClass: 'text-(--accent-primary) bg-(--accent-primary-subtle) border border-(--border-subtle)'
  },
  {
    min: 3.5,
    max: 4.2,
    label: 'Proficient',
    studentLabel: 'Solid Strength',
    parentLabel: 'Strong Foundation',
    colorClass: 'text-(--accent-success) bg-(--accent-success-subtle) border border-(--border-subtle)'
  },
  {
    min: 4.3,
    max: 5.0,
    label: 'Advanced',
    studentLabel: 'Superpower',
    parentLabel: 'Advanced Demonstrated Capability',
    colorClass: 'text-(--accent-indigo) bg-(--accent-indigo-subtle) border border-(--border-subtle)'
  }
];

export function getCompetencyDescriptor(score: number, role: AudienceRole = 'student'): { label: string; colorClass: string } {
  for (const band of COMPETENCY_BANDS) {
    if (score >= band.min && score <= band.max) {
      const label = role === 'student' ? band.studentLabel : (role === 'parent' ? band.parentLabel : band.label);
      return { label, colorClass: band.colorClass };
    }
  }
  const defaultBand = COMPETENCY_BANDS[2];
  return {
    label: role === 'student' ? defaultBand.studentLabel : (role === 'parent' ? defaultBand.parentLabel : defaultBand.label),
    colorClass: defaultBand.colorClass
  };
}
