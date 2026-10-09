import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;

/**
 * Initializes and registers GSAP ScrollTrigger safely in browser context.
 * Tree-shaking safe and idempotent.
 */
export function initScrollTrigger(): typeof gsap | null {
  if (typeof window === 'undefined') return null;

  if (!isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }

  return gsap;
}

/**
 * Checks if the user has requested reduced motion.
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Creates a scoped ScrollTrigger animation with automatic cleanup handler.
 */
export function createScrollSection(
  triggerElement: HTMLElement | string,
  onEnterCallback: (ctx: gsap.Context) => void
): () => void {
  const g = initScrollTrigger();
  if (!g || isReducedMotion()) {
    return () => {};
  }

  const ctx = g.context(() => {
    ScrollTrigger.create({
      trigger: triggerElement,
      start: 'top 85%',
      once: true,
      onEnter: () => onEnterCallback(ctx)
    });
  });

  return () => {
    ctx.revert();
  };
}

/**
 * Cleanup helper for component destroy lifecycle.
 */
export function cleanupScrollTriggers(scopeElement?: HTMLElement): void {
  if (typeof window === 'undefined') return;
  if (scopeElement) {
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === scopeElement || scopeElement.contains(trigger.trigger as Node)) {
        trigger.kill();
      }
    });
  }
}
