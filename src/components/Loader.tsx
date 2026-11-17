import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, INTRO_KEY, introWillShow } from "../motion/setup";
import { Lotus, lotusReset } from "./Lotus";
import { Wordmark } from "./Wordmark";

export function Loader() {
  const [show, setShow] = useState(introWillShow);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!show) return;
      const el = ref.current!;
      const html = document.documentElement;
      window.__lenis?.stop();
      html.style.overflow = "hidden";
      const block = (e: Event) => e.preventDefault();
      window.addEventListener("wheel", block, { passive: false });
      window.addEventListener("touchmove", block, { passive: false });

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        window.removeEventListener("wheel", block);
        window.removeEventListener("touchmove", block);
        html.style.overflow = "";
        window.__lenis?.start();
        window.__introDone = true;
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {
          /* sem storage */
        }
        window.dispatchEvent(new Event("site:intro-done"));
      };

      const lotus = el.querySelector("[data-loader-lotus]")!;
      lotusReset(lotus);
      const petals = lotus.querySelectorAll(".lotus-petal");
      const rules = lotus.querySelectorAll(".lotus-rule");
      const dot = lotus.querySelectorAll(".lotus-dot");
      const word = el.querySelector("[data-logo-word]");
      const role = el.querySelector("[data-logo-role]");
      const bar = el.querySelector("[data-loader-bar]");

      gsap.set(word, { yPercent: 105 });
      gsap.set(role, { autoAlpha: 0 });
      gsap.set(bar, { scaleX: 0, transformOrigin: "0% 50%" });

      const tl = gsap.timeline({
        onComplete: () => setShow(false),
      });
      tl.to(petals, { drawSVG: "0% 100%", duration: 1.2, stagger: 0.12, ease: "power2.inOut" }, 0)
        .to(dot, { scale: 1, duration: 0.6, ease: "back.out(2)" }, 0.4)
        .fromTo(rules, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.45)
        .to(rules, { drawSVG: "0% 100%", duration: 0.9, ease: "breath" }, 0.45)
        .to(word, { yPercent: 0, duration: 0.9 }, 0.65)
        .fromTo(role, { autoAlpha: 0, scaleX: 1.22 }, { autoAlpha: 0.8, scaleX: 1, duration: 1, ease: "power3.out" }, 0.8)
        .to(bar, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
        .add(() => {
          el.style.pointerEvents = "none";
          finish();
        }, 1.85)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" }, 1.85);

      const safety = window.setTimeout(() => {
        finish();
        setShow(false);
      }, 3800);
      return () => {
        window.clearTimeout(safety);
        finish();
      };
    },
    { scope: ref, dependencies: [show] },
  );

  if (!show) return null;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cream text-bronze"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="flex flex-col items-center gap-7">
        <div data-loader-lotus>
          <Lotus base sw={2} className="w-[7.5rem] sm:w-[8.75rem]" />
        </div>
        <div className="text-forest">
          <Wordmark compact noLotus />
        </div>
        <div className="h-px w-36 bg-bronze/15 sm:w-44">
          <div data-loader-bar className="h-px w-full bg-bronze/80" />
        </div>
      </div>
    </div>
  );
}
