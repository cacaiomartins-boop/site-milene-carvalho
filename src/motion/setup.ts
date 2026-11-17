import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText, CustomEase);
CustomEase.create("silk", "0.22, 1, 0.36, 1");
CustomEase.create("breath", "0.45, 0, 0.2, 1");
gsap.defaults({ ease: "silk", duration: 1.1 });

declare global {
  interface Window {
    __lenis?: Lenis;
    __motionReady?: boolean;
    __introDone?: boolean;
    dataLayer?: unknown[];
    gtag?: (...a: unknown[]) => void;
    fbq?: (...a: unknown[]) => void;
  }
}

export const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktop: "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 640px)",
  notDesktop: "(prefers-reduced-motion: no-preference) and (max-width: 1023px), (prefers-reduced-motion: no-preference) and (max-height: 639px)",
  wide: "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
  fine: "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
};

export const INTRO_KEY = "site-intro-seen";
let seen = false;
try {
  seen = !!sessionStorage.getItem(INTRO_KEY);
} catch {
  seen = false;
}
export const introWillShow = !reduce() && !seen;
window.__introDone = !introWillShow;

export function initLenis() {
  if (window.__lenis) return window.__lenis;
  if (reduce() || matchMedia("(pointer: coarse)").matches) return undefined;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 0.95,
  });
  window.__lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToTarget(target: string | number | HTMLElement, offset = -72) {
  const l = window.__lenis;
  if (l) l.scrollTo(target as never, { offset, duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

window.__motionReady = true;

export { gsap, ScrollTrigger, SplitText, Lenis };
