import { useId, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ, ScrollTrigger } from "../motion/setup";
import { Lotus } from "./Lotus";

/** Selo circular com texto girando ao redor de um lótus. */
export function Seal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current!;
        const ring = el.querySelector("[data-seal-ring]")!;
        gsap.set(ring, { transformOrigin: "50% 50%" });
        const spin = gsap.to(ring, { rotation: 360, duration: 36, ease: "none", repeat: -1, paused: true });
        gsap.fromTo(
          el,
          { scale: 0.4, rotate: -120, autoAlpha: 0 },
          {
            scale: 1,
            rotate: 0,
            autoAlpha: 1,
            duration: 1.8,
            scrollTrigger: { trigger: el, start: "top 90%", once: true, end: "max" },
            onComplete: () => {
              spin.play();
            },
          },
        );
        let visible = false;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            if (!visible) spin.pause();
            else if (spin.paused() && (el.style.visibility === "visible" || getComputedStyle(el).visibility === "visible")) spin.play();
          },
        });
        const speed = ScrollTrigger.create({
          onUpdate: (self) => {
            if (!visible) return;
            const v = Math.abs(self.getVelocity());
            gsap.to(spin, { timeScale: 1 + Math.min(v / 400, 6), duration: 0.2, overwrite: true, onComplete: () => {
              gsap.to(spin, { timeScale: 1, duration: 1.8, ease: "power2.out" });
            } });
          },
        });
        return () => {
          st.kill();
          speed.kill();
          spin.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal className={`relative grid aspect-square place-items-center rounded-full bg-ivory/90 shadow-soft backdrop-blur ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full text-bronze-deep" aria-hidden="true">
        <defs>
          <path id={`seal-${id}`} d="M100,100 m-79,0 a79,79 0 1,1 158,0 a79,79 0 1,1 -158,0" />
        </defs>
        <g data-seal-ring>
          <text fontSize="12.5" fontWeight="500" fill="currentColor" style={{ fontFamily: "var(--font-sans)" }}>
            <textPath href={`#${id ? "seal-" + id : ""}`} textLength="494" lengthAdjust="spacing">
              {text}
            </textPath>
          </text>
        </g>
      </svg>
      <div className="w-[30%] text-forest">
        <Lotus base sw={9} className="w-full" />
      </div>
    </div>
  );
}
