import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      respectReducedMotion: false,
    });

    const pendingFrames = new Set<number>();

    function navigate(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      )
        return;

      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      const target = hash ? document.getElementById(hash.slice(1)) : null;
      if (!target || !hash || link?.hasAttribute("download")) return;
      event.preventDefault();

      // Let the mobile menu close before measuring the target's position.
      const frame = window.requestAnimationFrame(() => {
        pendingFrames.delete(frame);
        if (
          window.location.protocol !== "about:" &&
          window.location.hash !== hash
        ) {
          // Opaque-origin preview frames may not permit history updates.
          try {
            window.history.pushState(null, "", hash);
          } catch {
            /* Scroll still works. */
          }
        }

        const focusTarget = () => {
          if (event.detail !== 0) return;
          if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
          target.focus({ preventScroll: true });
        };

        lenis.scrollTo(target, {
          duration: 1.15,
          lerp: 0,
          easing: (progress) => 1 - Math.pow(1 - progress, 4),
          onComplete: focusTarget,
        });
      });
      pendingFrames.add(frame);
    }

    document.addEventListener("click", navigate);
    return () => {
      document.removeEventListener("click", navigate);
      pendingFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      lenis.destroy();
    };
  }, []);

  return null;
}
