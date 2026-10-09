import { gsap } from 'gsap';
import { initScrollTrigger, isReducedMotion } from './scroll.js';

export interface RevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  triggerOnScroll?: boolean;
}

/**
 * Standard Carbon Voltage entrance reveal.
 * Subtle, fast, engineered (400–700ms).
 */
export function revealElements(
  targets: gsap.DOMTarget,
  options: RevealOptions = {}
): gsap.core.Tween | gsap.core.Timeline | null {
  const g = initScrollTrigger();
  if (!g) return null;

  const {
    y = 16,
    duration = 0.5,
    stagger = 0.06,
    delay = 0,
    ease = 'power3.out'
  } = options;

  if (isReducedMotion()) {
    return g.set(targets, { opacity: 1, y: 0 });
  }

  return g.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease,
      clearProps: 'transform'
    }
  );
}

/**
 * Svelte Action: use:revealOnScroll
 * Automatically hooks up ScrollTrigger on mount and cleans up on unmount.
 */
export function revealOnScroll(
  node: HTMLElement,
  options: RevealOptions = {}
): { destroy: () => void } {
  const g = initScrollTrigger();
  if (!g || isReducedMotion()) {
    node.style.opacity = '1';
    return { destroy: () => {} };
  }

  const {
    y = 16,
    duration = 0.5,
    stagger = 0.05,
    delay = 0,
    ease = 'power3.out'
  } = options;

  const ctx = g.context(() => {
    const children = node.querySelectorAll('[data-reveal-item]');
    const targets = children.length > 0 ? children : node;

    g.fromTo(
      targets,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        delay,
        ease,
        scrollTrigger: {
          trigger: node,
          start: 'top 88%',
          once: true
        },
        clearProps: 'transform'
      }
    );
  }, node);

  return {
    destroy() {
      ctx.revert();
    }
  };
}
