import { createElement, useRef, type ReactNode, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ, ScrollTrigger, SplitText } from "../motion/setup";
import { Rich } from "../motion/rich";

/* ---------- Eyebrow ---------- */
export function Eyebrow({ n, children, className = "" }: { n?: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current!;
        const line = el.querySelector("[data-ey-line]");
        const num = el.querySelector("[data-ey-num]");
        const label = el.querySelector("[data-ey-label]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true, end: "max" } });
        gsap.set(el, { autoAlpha: 1 });
        if (line) tl.fromTo(line, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 1.2 }, 0);
        if (num) tl.fromTo(num, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 1 }, 0);
        if (label) tl.fromTo(label, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 1.4, ease: "power3.out" }, 0.1);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} data-reveal className={`flex items-center gap-4 text-bronze ${className}`}>
      {n && (
        <span data-ey-num className="font-display text-[1.35rem] italic leading-none">
          {n}
        </span>
      )}
      <span data-ey-line className="h-px w-10 bg-current opacity-60" />
      <span data-ey-label className="text-xs font-medium uppercase tracking-[0.3em]">
        {children}
      </span>
    </div>
  );
}

/* ---------- Reveal ---------- */
interface RevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  items?: boolean;
  y?: number;
  stagger?: number;
  start?: string;
  [k: string]: unknown;
}
export function Reveal({ as = "div", className, children, items = false, y = 36, stagger = 0.12, start = "top 82%", ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current!;
        const targets = items ? el.querySelectorAll("[data-reveal-item]") : [el];
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y },
          { autoAlpha: 1, y: 0, duration: 1.2, stagger, ease: "silk", scrollTrigger: { trigger: el, start, once: true, end: "max" } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return createElement(as, { ref, className, ...(items ? {} : { "data-reveal": "" }), ...rest }, children);
}

/* ---------- SplitHeading ---------- */
export function SplitHeading({
  as = "h2",
  text,
  className = "",
  start = "top 85%",
  id,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  start?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current!;
        let st: SplitText | undefined;
        let played = false;
        let lastW = 0;
        let dead = false;
        const build = () => {
          st?.revert();
          st = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
          if (!played) gsap.set(st.lines, { yPercent: 110 });
          lastW = el.clientWidth;
          gsap.set(el, { autoAlpha: 1 });
        };
        let trig: ScrollTrigger | undefined;
        document.fonts.ready.then(() => {
          if (dead || !el.isConnected) return;
          build();
          trig = ScrollTrigger.create({
            trigger: el,
            start,
            end: "max",
            once: true,
            onEnter: () => {
              played = true;
              gsap.to(st!.lines, { yPercent: 0, duration: 1.25, stagger: 0.1, ease: "silk", overwrite: true });
            },
          });
        });
        const ro = new ResizeObserver(() => {
          if (!st || Math.abs(el.clientWidth - lastW) < 2) return;
          build();
        });
        ro.observe(el);
        return () => {
          dead = true;
          ro.disconnect();
          trig?.kill();
          st?.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return createElement(as, { ref, id, className: `${as === "h2" ? "h2-section" : ""} ${className}`, "data-reveal": "" }, <Rich text={text} />);
}

/* ---------- ImageReveal ---------- */
export function ImageReveal({
  src,
  alt,
  className = "",
  imgClassName = "",
  from = "bottom",
  eager = false,
  width,
  height,
  position = "center",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  from?: "bottom" | "left" | "right" | "center";
  eager?: boolean;
  width?: number;
  height?: number;
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current!;
        const img = el.querySelector("img")!;
        const fromClip = {
          bottom: "inset(100% 0% 0% 0%)",
          left: "inset(0% 100% 0% 0%)",
          right: "inset(0% 0% 0% 100%)",
          center: "inset(18% round 999px)",
        }[from];
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true, end: "max" } });
        tl.fromTo(el, { clipPath: fromClip }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "breath" }, 0);
        tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 2, ease: "silk" }, 0);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={{ objectPosition: position }}
        className={`size-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

/* ---------- Counter ---------- */
export function Counter({ to, className = "" }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const obj = { v: 0 };
        const el = ref.current!;
        gsap.to(obj, {
          v: to,
          duration: 2.4,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true, end: "max" },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString("pt-BR");
          },
        });
        el.textContent = "0";
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={className}>
      {to.toLocaleString("pt-BR")}
    </span>
  );
}
