import { gsap } from 'gsap';
import { isReducedMotion } from './scroll.js';

/**
 * Animate a numeric readout smoothly using GSAP.
 * Ideal for telemetry metrics, CAT percentiles, and scores.
 */
export function animateMetricCounter(
  targetElement: HTMLElement,
  endValue: number,
  duration = 0.8,
  decimals = 0
): () => void {
  if (isReducedMotion() || typeof window === 'undefined') {
    targetElement.textContent = endValue.toFixed(decimals);
    return () => {};
  }

  const obj = { val: 0 };
  const tween = gsap.to(obj, {
    val: endValue,
    duration,
    ease: 'power3.out',
    onUpdate: () => {
      targetElement.textContent = obj.val.toFixed(decimals);
    }
  });

  return () => {
    tween.kill();
  };
}

/**
 * Subtle magnetic feedback for primary CTAs.
 * High-restraint: Maximum displacement restricted to 4px.
 */
export function magneticHover(
  node: HTMLElement,
  strength = 0.2
): { destroy: () => void } {
  if (isReducedMotion() || typeof window === 'undefined') {
    return { destroy: () => {} };
  }

  const handleMouseMove = (e: MouseEvent) => {
    const rect = node.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    // Limit maximum magnetic pull to 4px
    const moveX = Math.max(-4, Math.min(4, relX * strength));
    const moveY = Math.max(-4, Math.min(4, relY * strength));

    gsap.to(node, {
      x: moveX,
      y: moveY,
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(node, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: 'power3.out'
    });
  };

  node.addEventListener('mousemove', handleMouseMove);
  node.addEventListener('mouseleave', handleMouseLeave);

  return {
    destroy() {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(node);
    }
  };
}

export interface CountUpOptions {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

/**
 * Svelte Action: use:countUp
 * Rolls up a number on scroll into view with GSAP and IntersectionObserver.
 */
export function countUp(
  node: HTMLElement,
  options: CountUpOptions
): { destroy: () => void } {
  const { value, prefix = '', suffix = '', duration = 1.0, decimals = 0 } = options;

  if (isReducedMotion() || typeof window === 'undefined') {
    const formatted = decimals > 0 ? value.toFixed(decimals) : value.toLocaleString();
    node.textContent = `${prefix}${formatted}${suffix}`;
    return { destroy: () => {} };
  }

  node.textContent = `${prefix}0${suffix}`;

  let tween: gsap.core.Tween | null = null;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const obj = { val: 0 };
          tween = gsap.to(obj, {
            val: value,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              const formatted = decimals > 0
                ? obj.val.toFixed(decimals)
                : Math.round(obj.val).toLocaleString();
              node.textContent = `${prefix}${formatted}${suffix}`;
            }
          });
          observer.unobserve(node);
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
      tween?.kill();
    }
  };
}
