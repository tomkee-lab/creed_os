import { browser } from '$app/environment';

export type Theme = 'dark' | 'light';

export function getInitialTheme(): Theme {
  if (!browser) return 'dark';
  const saved = localStorage.getItem('way_theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme) {
  if (!browser) return;
  const isDark = theme === 'dark';
  const html = document.documentElement;

  if (isDark) {
    html.classList.add('dark');
    html.classList.remove('light');
    html.setAttribute('data-theme', 'dark');
    html.style.colorScheme = 'dark';
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    html.setAttribute('data-theme', 'light');
    html.style.colorScheme = 'light';
  }

  try {
    localStorage.setItem('way_theme', theme);
  } catch {
    // Local storage may be restricted in sandboxed iframes
  }

  window.dispatchEvent(new CustomEvent('way_theme_change', { detail: { theme } }));
}

export function toggleTheme(): Theme {
  if (!browser) return 'dark';
  const isDark = document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark';
  const next: Theme = isDark ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
