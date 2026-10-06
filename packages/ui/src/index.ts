import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface MetricBand {
  min: number;
  max: number;
  label: string;
  colorClass: string;
}

export const COMPETENCY_BANDS: MetricBand[] = [
  { min: 1.0, max: 2.4, label: 'Developing', colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { min: 2.5, max: 3.4, label: 'Expected', colorClass: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  { min: 3.5, max: 4.2, label: 'Proficient', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { min: 4.3, max: 5.0, label: 'Advanced', colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30' }
];

export function getCompetencyDescriptor(score: number): { label: string; colorClass: string } {
  for (const band of COMPETENCY_BANDS) {
    if (score >= band.min && score <= band.max) {
      return { label: band.label, colorClass: band.colorClass };
    }
  }
  return { label: 'Proficient', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
}
