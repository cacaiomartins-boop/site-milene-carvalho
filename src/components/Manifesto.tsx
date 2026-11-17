import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ, SplitText } from "../motion/setup";
import { clinic, manifesto } from "../data/clinic";
import { Lotus, lotusReset } from "./Lotus";

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const $ = (s: string) => root.querySelector<HTMLElement>(s)!;
      const $$ = (s: string) => gsap.utils.toArray<HTMLElement>(s, root);
      const block = $("[data-manifesto-block]");
      const text = $("[data-manifesto-text]");
      const lotus = $("[data-manifesto-lotus]");
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // entrada do bloco: abre as laterais
        gsap.fromTo(
          block,
          { clipPath: "inset(0% 3% 0% 3% round 2.5rem 2.5rem 0rem 0rem)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0rem 0rem 0rem 0rem)",
            ease: "none",
            scrollTrigger: { trigger: block, start: "top bottom", end: "top 20%", scrub: true },
          },
        );
        const split = SplitText.create(text, { type: "words", wordsClass: "manifesto-word" });
        gsap.set(split.words, { opacity: 0.14 });
        return () => split.revert();
      });

      mm.add(MQ.desktop, () => {
        const words = $$(".manifesto-word");
        lotusReset(lotus);
        gsap.set($("[data-manifesto-topline]"), { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set($$("[data-manifesto-label]"), { autoAlpha: 0 });
        gsap.set($("[data-manifesto-quote]"), { autoAlpha: 0, y: 26 });
        gsap.set($$("[data-manifesto-value]"), { autoAlpha: 0, y: 14 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: text, start: "top 40%", end: "85% bottom", scrub: 0.8 },
          defaults: { ease: "none" },
        });
        tl.to($("[data-manifesto-topline]"), { scaleX: 1, duration: 0.16 }, 0)
          .to($$("[data-manifesto-label]"), { autoAlpha: 1, duration: 0.1, stagger: 0.04 }, 0)
          .to(words, { opacity: 1, duration: 0.68, stagger: { amount: 0.62 } }, 0.02)
          .to(lotus.querySelectorAll(".lotus-petal"), { drawSVG: "0% 100%", duration: 0.4, stagger: 0.06, ease: "power1.inOut" }, 0.2)
          .to(lotus.querySelectorAll(".lotus-dot"), { scale: 1, duration: 0.1, ease: "back.out(2)" }, 0.6)
          .to(lotus.querySelectorAll(".lotus-rule"), { drawSVG: "0% 100%", duration: 0.13 }, 0.62)
          .to($("[data-manifesto-quote]"), { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.76)
          .to($$("[data-manifesto-value]"), { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.03 }, 0.86);
      });

      mm.add(MQ.notDesktop, () => {
        const words = $$(".manifesto-word");
        gsap.to(words, {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: text, start: "top 82%", end: "bottom 40%", scrub: true },
        });
        lotusReset(lotus);
        const tl = gsap.timeline({ scrollTrigger: { trigger: lotus, start: "top 85%", once: true, end: "max" } });
        tl.to(lotus.querySelectorAll(".lotus-petal"), { drawSVG: "0% 100%", duration: 1.4, stagger: 0.12, ease: "power2.inOut" })
          .to(lotus.querySelectorAll(".lotus-dot"), { scale: 1, duration: 0.8, ease: "back.out(2)" }, "-=0.4")
          .to(lotus.querySelectorAll(".lotus-rule"), { drawSVG: "0% 100%", duration: 1.1 }, "<");
        gsap.from($$("[data-manifesto-quote],[data-manifesto-value]"), {
          autoAlpha: 0,
          y: 24,
          duration: 1.2,
          stagger: 0.1,
          scrollTrigger: { trigger: $("[data-manifesto-quote]"), start: "top 88%", once: true, end: "max" },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="manifesto" ref={ref} data-theme="dark" className="relative bg-forest-deep">
      <div data-manifesto-block className="grain dark-glow relative overflow-hidden">
        <div className="container-site relative py-24 sm:py-32 lg:py-44">
          <div className="flex items-center gap-6 text-gold-soft">
            <h2 data-manifesto-label className="!font-sans !text-xs font-medium uppercase tracking-[0.32em] !text-gold-soft">
              Manifesto
            </h2>
            <span data-manifesto-topline className="h-px flex-1 bg-gold-soft/40" />
            <span data-manifesto-label className="text-xs font-medium uppercase tracking-[0.32em]">
              {clinic.name}
            </span>
          </div>

          <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <p
                data-manifesto-text
                className="font-display text-[clamp(2rem,4.6vw,4.25rem)] font-medium leading-[1.08] text-ivory"
              >
                {manifesto.sentence}
              </p>
              <p data-manifesto-quote className="mt-12 max-w-[32rem] font-display text-[1.4rem] italic leading-snug text-gold-soft sm:text-[1.6rem]">
                {manifesto.quote}
              </p>
              <ul className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium uppercase tracking-[0.3em] text-ivory/85">
                {manifesto.values.map((v, i) => (
                  <li key={v} data-manifesto-value className="flex items-center gap-5">
                    {i > 0 && <span className="size-1.5 rotate-45 bg-gold-soft" aria-hidden="true" />}
                    {v}
                  </li>
                ))}
              </ul>
            </div>
            <div data-manifesto-lotus className="mx-auto w-[min(60%,14rem)] text-gold-soft lg:col-span-4 lg:w-full lg:max-w-[22rem]">
              <Lotus base sw={1.4} className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
