import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ, ScrollTrigger } from "../motion/setup";
import { process as proc } from "../data/clinic";
import { Eyebrow, Reveal, SplitHeading } from "./ui";
import { Lotus, lotusReset } from "./Lotus";
import { WhatsAppButton } from "./WhatsAppButton";

export default function Process() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const $ = (s: string) => root.querySelector<HTMLElement>(s)!;
      const $$ = (s: string) => gsap.utils.toArray<HTMLElement>(s, root);
      const steps = $$("[data-step]");
      const dots = $$("[data-dot]");
      const rings = $$("[data-ring]");
      const lits = $$("[data-lit]");
      const trail = $("[data-trail]");
      const lotus = $("[data-process-lotus]");
      const glow = $("[data-lotus-glow]");
      const mm = gsap.matchMedia();

      mm.add(MQ.wide, () => {
        const segs = $$("[data-seg-x]");
        gsap.set(segs, { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(dots, { scale: 0 });
        gsap.set(lits, { autoAlpha: 0.55, y: 10 });
        gsap.set(glow, { autoAlpha: 0, scale: 0.8 });
        gsap.set(rings, { autoAlpha: 0 });
        lotusReset(lotus);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: trail, start: "top 70%", end: "bottom 65%", scrub: 0.6 },
          defaults: { ease: "none" },
        });
        let t = 0.08;
        steps.forEach((_, i) => {
          tl.to(dots[i], { scale: 1, duration: 0.35, ease: "back.out(2)" }, t)
            .to(steps[i].querySelectorAll("[data-lit]"), { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }, t)
            .fromTo(rings[i], { scale: 1, autoAlpha: 0.85 }, { scale: 2.1, autoAlpha: 0, duration: 1.4, ease: "power2.out" }, t)
            .to(segs[i], { scaleX: 1, duration: i === steps.length - 1 ? 0.6 : 1 }, t + 0.35);
          t += 0.3;
        });
        tl.to(glow, { autoAlpha: 0.7, scale: 1, duration: 0.8 }, t)
          .to(lotus.querySelectorAll(".lotus-petal"), { drawSVG: "0% 100%", duration: 0.7, stagger: 0.12, ease: "power1.inOut" }, t)
          .to(lotus.querySelectorAll(".lotus-rule"), { drawSVG: "0% 100%", duration: 0.55 }, t + 0.3)
          .to(lotus.querySelectorAll(".lotus-dot"), { scale: 1, duration: 0.3, ease: "back.out(2)" }, t + 0.5);
      });

      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 1023px)", () => {
        const fill = $("[data-vfill]");
        gsap.set(fill, { scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(dots, { scale: 0 });
        gsap.set(lits, { autoAlpha: 0.55, y: 10 });
        gsap.set(rings, { autoAlpha: 0 });
        lotusReset(lotus);
        gsap.to(fill, { scaleY: 1, ease: "none", scrollTrigger: { trigger: trail, start: "top 62%", end: "bottom 62%", scrub: 0.6 } });
        steps.forEach((li, i) => {
          ScrollTrigger.create({
            trigger: li,
            start: "center 62%",
            onEnter: () => {
              gsap.to(dots[i], { scale: 1, duration: 0.6, ease: "back.out(2)", overwrite: true });
              gsap.to(steps[i].querySelectorAll("[data-lit]"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, overwrite: true });
              gsap.fromTo(rings[i], { scale: 1, autoAlpha: 0.85 }, { scale: 2.1, autoAlpha: 0, duration: 1.4, ease: "power2.out" });
            },
            onLeaveBack: () => {
              gsap.to(dots[i], { scale: 0, duration: 0.4, overwrite: true });
              gsap.to(steps[i].querySelectorAll("[data-lit]"), { autoAlpha: 0.55, y: 10, duration: 0.6, overwrite: true });
            },
          });
        });
        const tl = gsap.timeline({ scrollTrigger: { trigger: lotus, start: "top 60%", once: true, end: "max" } });
        tl.to(lotus.querySelectorAll(".lotus-petal"), { drawSVG: "0% 100%", duration: 1.3, stagger: 0.12, ease: "power2.inOut" })
          .to(lotus.querySelectorAll(".lotus-rule"), { drawSVG: "0% 100%", duration: 1 }, "<0.3")
          .to(lotus.querySelectorAll(".lotus-dot"), { scale: 1, duration: 0.6, ease: "back.out(2)" }, "<0.3");
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="processo" ref={ref} className="relative overflow-clip bg-linen section-pad">
      <div className="container-site">
        <Eyebrow n="04">Como funciona</Eyebrow>
        <div className="mt-2 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SplitHeading text={proc.title} />
          </div>
          <Reveal className="lg:col-span-5">
            <p className="text-[1.0625rem] text-text">{proc.intro}</p>
          </Reveal>
        </div>

        <div data-trail className="relative mt-16 lg:mt-24">
          {/* linha vertical (mobile) */}
          <span className="absolute bottom-6 left-[1.375rem] top-2 w-px bg-bronze/20 lg:hidden" aria-hidden="true" />
          <span data-vfill className="absolute bottom-6 left-[1.375rem] top-2 w-px bg-bronze lg:hidden" aria-hidden="true" />

          <ol className="grid gap-12 lg:grid-cols-[repeat(4,1fr)_7rem] lg:gap-0">
            {proc.steps.map((s, i) => (
              <li key={s.title} data-step className="relative pl-16 lg:pl-0 lg:pr-8 lg:pt-14">
                {/* nó */}
                <span className="absolute left-[0.6rem] top-2 grid size-[22px] place-items-center rounded-full border border-bronze bg-linen lg:left-0 lg:top-0 lg:-translate-y-0">
                  <span data-dot className="size-2 rounded-full bg-bronze" />
                  <span data-ring className="absolute inset-0 rounded-full border border-bronze" />
                </span>
                {/* segmento horizontal (desktop) */}
                <span data-seg-x className="absolute left-[22px] right-0 top-[11px] hidden h-px bg-bronze/60 lg:block" aria-hidden="true" />
                <span data-lit className="block font-display text-[3.2rem] italic leading-none text-gold lg:text-[4.25rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 data-lit className="mt-3 text-[1.6rem] font-medium">
                  {s.title}
                </h3>
                <p data-lit className="mt-2 text-text">
                  {s.text}
                </p>
              </li>
            ))}
            <li className="relative flex items-start justify-start pl-[1.1rem] lg:justify-center lg:pl-0" aria-hidden="true">
              <div className="relative w-[3.4rem] text-bronze lg:-mt-4 lg:w-[5rem]">
                <div data-lotus-glow className="absolute -inset-8 rounded-full bg-gold-soft/50 blur-2xl" />
                <div data-process-lotus className="relative">
                  <Lotus base sw={1.5} className="w-full" />
                </div>
              </div>
            </li>
          </ol>
        </div>

        <Reveal className="mt-16 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <WhatsAppButton size="lg" message="processo">
            {proc.button}
          </WhatsAppButton>
          <p className="font-display text-[1.3rem] italic text-text">{proc.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}
