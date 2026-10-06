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
    colorClass: 'text-[oklch(0.680_0.150_75)] bg-[oklch(0.960_0.030_75)] border-[oklch(0.850_0.060_75)] dark:bg-[oklch(0.220_0.040_75)]'
  },
  {
    min: 2.5,
    max: 3.4,
    label: 'Expected',
    studentLabel: 'On Track',
    parentLabel: 'Age Expected',
    colorClass: 'text-[oklch(0.550_0.140_215)] bg-[oklch(0.960_0.025_215)] border-[oklch(0.850_0.050_215)] dark:bg-[oklch(0.220_0.040_215)]'
  },
  {
    min: 3.5,
    max: 4.2,
    label: 'Proficient',
    studentLabel: 'Solid Strength',
    parentLabel: 'Strong Foundation',
    colorClass: 'text-[oklch(0.600_0.140_150)] bg-[oklch(0.950_0.030_150)] border-[oklch(0.850_0.050_150)] dark:bg-[oklch(0.220_0.040_150)]'
  },
  {
    min: 4.3,
    max: 5.0,
    label: 'Advanced',
    studentLabel: 'Superpower',
    parentLabel: 'Advanced Demonstrated Capability',
    colorClass: 'text-[oklch(0.560_0.150_280)] bg-[oklch(0.960_0.025_280)] border-[oklch(0.850_0.050_280)] dark:bg-[oklch(0.220_0.040_280)]'
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
