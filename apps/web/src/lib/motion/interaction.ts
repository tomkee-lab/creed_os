import { gsap } from 'gsap';
import { isReducedMotion } from './scroll.js';

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
