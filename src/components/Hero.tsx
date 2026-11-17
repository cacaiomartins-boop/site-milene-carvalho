import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, MQ, SplitText } from "../motion/setup";
import { clinic, hero, topics } from "../data/clinic";
import { Rich } from "../motion/rich";
import { GhostLotus } from "./Lotus";
import { WhatsAppButton } from "./WhatsAppButton";
import { HashLink } from "./HashLink";
import { TopicIcon } from "./icons";

const heroCards = ["ansiedade", "brasileiros-no-exterior", "relacionamentos"].map((s) => topics.find((t) => t.slug === s)!);
const cardLine: Record<string, string> = {
  ansiedade: "Preocupação, tensão e estresse",
  "brasileiros-no-exterior": "Terapia online, em português",
  relacionamentos: "Individual e de casal",
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const $ = (s: string) => root.querySelector<HTMLElement>(s)!;
      const $$ = (s: string) => gsap.utils.toArray<HTMLElement>(s, root);
      const textCol = $("[data-hero-text]");
      const h1 = $("[data-hero-title]");
      const em = h1.querySelector("em");
      const ul = $("[data-underline]");
      const halo = $("[data-hero-halo]");
      const haloPath = halo.querySelector("path")!;
      const haloDot = halo.querySelector("circle")!;
      let titleDone = false;

      const place = () => {
        if (!em) return;
        const c = textCol.getBoundingClientRect();
        const r = em.getBoundingClientRect();
        const fs = parseFloat(getComputedStyle(em).fontSize);
        ul.style.left = `${r.left - c.left - 0.08 * fs}px`;
        ul.style.top = `${r.top - c.top + 0.78 * r.height}px`;
        ul.style.width = `${r.width + 0.16 * fs}px`;
        ul.style.height = `${0.27 * fs}px`;
      };
      const drawHalo = () => {
        const w = halo.clientWidth,
          h = halo.clientHeight,
          r = w / 2;
        halo.setAttribute("viewBox", `0 0 ${w} ${h}`);
        const yEnd = h - 40;
        haloPath.setAttribute("d", `M1 ${yEnd} V${r} A${r - 1} ${r - 1} 0 0 1 ${w - 1} ${r} V${yEnd}`);
        haloDot.setAttribute("cx", String(w - 1));
        haloDot.setAttribute("cy", String(yEnd));
      };
      const measure = () => {
        drawHalo();
        if (titleDone) {
          place();
          gsap.set(ul.querySelectorAll("path"), { drawSVG: "0% 100%" });
          gsap.set(haloPath, { drawSVG: "0% 100%" });
        }
      };
      drawHalo();
      place();
      document.fonts.ready.then(() => {
        if (!root.isConnected) return;
        if (!titleDone) {
          drawHalo();
        }
        place();
      });
      const ro = new ResizeObserver(measure);
      ro.observe(root);

      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.set($$("[data-hero-in]"), { autoAlpha: 1 });
        const frame = $("[data-hero-frame]");
        const img = $("[data-hero-img]");
        const split = SplitText.create(h1, { type: "lines", mask: "lines", linesClass: "split-line" });
        const eyebrowLabel = $("[data-hero-eyebrow]");
        const eyeFs = parseFloat(getComputedStyle(eyebrowLabel).fontSize);
        const wide = window.innerWidth >= 640;

        const tl = gsap.timeline({ paused: true });
        tl.fromTo(
          frame,
          { clipPath: "inset(38% 22% 0% 22% round 50cqw 50cqw 32px 32px)" },
          { clipPath: "inset(0% 0% 0% 0% round 50cqw 50cqw 32px 32px)", duration: 1.6, ease: "breath" },
          0,
        )
          .set(frame, { clearProps: "clipPath" }, 1.6)
          .fromTo(img, { scale: 1.16 }, { scale: 1, duration: 2.2 }, 0)
          .fromTo(img, { filter: "blur(14px)" }, { filter: "blur(0px)", duration: 1.6, ease: "power2.out" }, 0)
          .fromTo($("[data-hero-shadow]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.6 }, 0.2)
          .fromTo($("[data-ghost-lotus]"), { opacity: 0 }, { opacity: 0.07, duration: 2.4, ease: "breath" }, 0.2)
          .fromTo(
            eyebrowLabel,
            wide
              ? { autoAlpha: 0, letterSpacing: `${0.5 * eyeFs}px` }
              : { autoAlpha: 0, x: -14 },
            wide
              ? { autoAlpha: 1, letterSpacing: `${0.3 * eyeFs}px`, duration: 1.6, ease: "power3.out" }
              : { autoAlpha: 1, x: 0, duration: 1.6, ease: "power3.out" },
            0.15,
          )
          .fromTo($("[data-hero-eyeline]"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 1.2 }, 0.15)
          .fromTo(haloPath, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.9, ease: "power2.inOut" }, 0.55)
          .fromTo(haloDot, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.8, ease: "back.out(2)" }, 1.35)
          .from(
            split.lines,
            { yPercent: 140, rotate: 2, transformOrigin: "0% 100%", duration: 1.3, stagger: 0.12, delay: 0.35 },
            0,
          )
          .fromTo($("[data-hero-sub]"), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.95)
          .fromTo(
            $$("[data-hero-cta]"),
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 1.5, stagger: 0.08, clearProps: "transform" },
            0.05,
          )
          .fromTo($$("[data-hero-card]"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.12 }, 1.25);
        const paths = ul.querySelectorAll("path");
        paths.forEach((p, i) => {
          tl.fromTo(p, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.1, ease: "power2.inOut" }, 1.5 + i * 0.22);
        });
        tl.fromTo($("[data-hero-cueline]"), { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 1.4 }, 1.6)
          .fromTo($("[data-hero-cuetext]"), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 1.1 }, 1.95);
        tl.call(
          () => {
            titleDone = true;
            place();
          },
          [],
          3.2,
        );

        const arrow = gsap.to($("[data-cue-arrow]"), { y: 4, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true });
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? arrow.play() : arrow.pause()));
        io.observe(root);

        let timer = 0;
        const start = () => {
          window.clearTimeout(timer);
          tl.play();
        };
        if (window.__introDone) start();
        else {
          window.addEventListener("site:intro-done", start, { once: true });
          timer = window.setTimeout(start, 3800);
        }
        return () => {
          window.removeEventListener("site:intro-done", start);
          window.clearTimeout(timer);
          io.disconnect();
          split.revert();
        };
      });

      mm.add(MQ.desktop, () => {
        const text = $("[data-hero-text]");
        const cue = $("[data-hero-cue]");
        const portrait = $("[data-hero-portrait]");
        const cards = $$("[data-hero-card]");
        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 } })
          .to(portrait, { yPercent: 10, scale: 1.05, ease: "none" }, 0)
          .to([text, cue], { y: -(0.14 * text.offsetHeight), ease: "none" }, 0)
          .to(cards, { yPercent: (i) => -(6 + 5 * i), ease: "none" }, 0);
      });

      mm.add(MQ.fine, () => {
        const img = $("[data-hero-img]");
        const xTo = gsap.quickTo(img, "xPercent", { duration: 1.8, ease: "power3.out" });
        const yTo = gsap.quickTo(img, "yPercent", { duration: 1.8, ease: "power3.out" });
        let visible = true;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(root);
        const move = (e: PointerEvent) => {
          if (!visible) return;
          xTo(-(1.6 * (e.clientX / window.innerWidth - 0.5)));
          yTo(-(1.2 * (e.clientY / window.innerHeight - 0.5)));
        };
        window.addEventListener("pointermove", move);
        return () => {
          window.removeEventListener("pointermove", move);
          io.disconnect();
        };
      });

      return () => {
        ro.disconnect();
        mm.revert();
      };
    },
    { scope: ref },
  );

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative isolate overflow-clip pb-14 pt-[6.75rem] sm:pt-32 lg:min-h-[100svh] lg:pb-6 lg:pt-[clamp(5.25rem,14svh,6.5rem)]"
      style={{ background: "linear-gradient(180deg, #f5efe6 0%, #efe6d8 100%)" }}
    >
      <GhostLotus className="-right-[18%] -top-[6%] -z-10 h-[46rem] w-[56rem] lg:-right-[8%]" />
      <div className="container-site grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 lg:grid-rows-[1fr_auto] lg:gap-x-10">
        {/* Texto */}
        <div data-hero-text className="relative min-w-0 lg:self-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-bronze">
            <span data-hero-in data-hero-eyeline className="h-px w-8 bg-current opacity-60 sm:w-14" />
            <span data-hero-in data-hero-eyebrow className="flex flex-wrap items-center gap-x-3 text-xs font-medium uppercase tracking-[0.3em]">
              {hero.eyebrow.map((w, i) => (
                <span key={w} className="flex items-center gap-3">
                  {i > 0 && <span className="size-[3px] rounded-full bg-current" />}
                  {w}
                </span>
              ))}
            </span>
          </div>

          <h1
            data-hero-in
            data-hero-title
            className="mt-7 max-w-[7em] lg:mt-[clamp(1rem,3svh,1.75rem)] text-[clamp(2.6rem,11.5vw,4.25rem)] font-medium leading-[0.98] tracking-[-0.015em] lg:text-[clamp(2.6rem,min(5.4vw,7.6svh),5.75rem)] [&_em]:whitespace-nowrap"
          >
            <Rich text={hero.title} />
          </h1>
          <svg
            data-underline
            aria-hidden="true"
            viewBox="0 0 400 26"
            preserveAspectRatio="none"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            className="pointer-events-none absolute text-bronze"
          >
            <path data-hero-in d="M3 17.2C64 11.4 142 8.2 220 8.8c62 .5 118 3.5 177 8.6" strokeWidth="2.6" vectorEffect="non-scaling-stroke" />
            <path data-hero-in d="M54 21.8c78-4.6 164-6.2 262-3.2" strokeWidth="1.25" opacity=".5" vectorEffect="non-scaling-stroke" />
          </svg>

          <p data-hero-in data-hero-sub className="mt-8 max-w-[34rem] text-[1.15rem] leading-[1.65] text-text lg:mt-[clamp(0.9rem,2.6svh,1.5rem)] lg:text-[clamp(1rem,2.5svh,1.15rem)]">
            {hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-[clamp(1rem,3.2svh,1.75rem)]">
            <div data-hero-in data-hero-cta>
              <WhatsAppButton size="lg" icon="arrow" message="general">
                {hero.primary}
              </WhatsAppButton>
            </div>
            <div data-hero-in data-hero-cta>
              <HashLink to="#processo" className="u-link inline-flex min-h-11 items-center text-[1rem] font-medium text-forest">
                {hero.secondary}
              </HashLink>
            </div>
          </div>

          <div data-hero-in data-hero-cta className="mt-8 text-[0.9375rem] text-muted lg:mt-[clamp(0.9rem,2.6svh,1.5rem)]">
            <p>{hero.credential}</p>
            <p>{hero.modality}</p>
          </div>
        </div>

        {/* Foto */}
        <div data-hero-stage className="relative mx-auto mt-12 w-full min-w-0 max-w-[30rem] lg:mt-0 lg:ml-auto lg:mr-0 lg:max-w-[min(100%,30rem,calc((100svh-16rem)*0.8))] lg:self-center">
          <div data-hero-portrait className="@container relative aspect-[4/5] [--arc-d:0.75rem] sm:[--arc-d:1.25rem] lg:[--arc-d:1.5rem]">
            <div
              data-hero-in
              data-hero-shadow
              className="absolute inset-x-[10%] -bottom-5 h-14 rounded-[50%] bg-bronze-deep/25 blur-2xl"
            />
            <div
              data-hero-in
              data-hero-frame
              className="absolute inset-0 overflow-hidden rounded-t-[50cqw] rounded-b-[2rem] bg-sand"
            >
              <img
                data-hero-img
                src={clinic.heroPhoto}
                alt={`${clinic.name}, psicóloga, sorrindo, de blazer escuro`}
                width={1195}
                height={1195}
                fetchPriority="high"
                className="size-full scale-[1.0] object-cover object-[50%_18%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep/20 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/25" />
            </div>
            <svg
              data-hero-halo
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              className="pointer-events-none absolute text-bronze"
              style={{ inset: "calc(-1 * var(--arc-d))", width: "calc(100% + 2 * var(--arc-d))", height: "calc(100% + 2 * var(--arc-d))" }}
            >
              <path data-hero-in vectorEffect="non-scaling-stroke" strokeWidth="1" strokeLinecap="round" opacity=".7" />
              <circle data-hero-in r="3.5" fill="currentColor" stroke="none" />
            </svg>

          </div>

            <ul className="no-scrollbar -mx-5 mt-10 flex scroll-px-5 snap-x gap-4 overflow-x-auto px-5 pb-4 lg:absolute lg:-bottom-6 lg:-left-4 lg:mx-0 lg:mt-0 lg:block lg:w-[15rem] lg:space-y-2 lg:overflow-visible lg:px-0 lg:pb-0 xl:-left-12">
              {heroCards.map((t, i) => (
                <li
                  key={t.slug}
                  data-hero-in
                  data-hero-card
                  className={`w-[17.25rem] shrink-0 snap-start lg:w-full ${i === 1 ? "lg:ml-2 xl:ml-5" : ""} ${i === 2 ? "lg:ml-4 xl:ml-10" : ""}`}
                >
                  <Link
                    to={`/terapia/${t.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-white/60 bg-ivory/85 p-3 shadow-soft lg:gap-2.5 lg:p-2.5 backdrop-blur transition-shadow duration-500 ease-silk hover:shadow-card"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-linen text-forest lg:size-9">
                      <TopicIcon slug={t.slug} className="size-5 lg:size-4" />
                    </span>
                    <span className="leading-tight">
                      <span className="block font-display text-[1.2rem] font-medium text-ink lg:text-[1.02rem]">{t.label}</span>
                      <span className="block text-[0.85rem] text-muted lg:text-[0.74rem]">{cardLine[t.slug]}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
        </div>

        {/* Cue de rolagem */}
        <div data-hero-cue className="hidden items-center gap-4 text-bronze lg:mt-2 lg:flex lg:pb-0 lg:pt-4">
          <span data-hero-in data-hero-cueline className="h-12 w-px bg-current opacity-50" />
          <span data-hero-in className="grid size-8 place-items-center rounded-full border border-current/40">
            <svg data-cue-arrow viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </span>
          <span data-hero-in data-hero-cuetext className="font-display text-[1.15rem] italic text-text">
            {hero.cue}
          </span>
        </div>
      </div>
    </section>
  );
}
