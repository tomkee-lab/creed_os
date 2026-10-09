declare module '$lib/paraglide/runtime.js' {
  export type Locale = 'en' | 'hi' | 'mr';
  export const locales: readonly Locale[];
  export function getLocale(): Locale;
  export function setLocale(locale: Locale): void;
  export function isLocale(locale: unknown): locale is Locale;
}
