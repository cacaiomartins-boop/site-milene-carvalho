import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ } from "../motion/setup";
import { clinic, reviews, reviewsNote, reviewsTitle } from "../data/clinic";
import { Eyebrow, FitBox, SplitHeading } from "./ui";

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-1 text-bronze ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} data-star viewBox="0 0 24 24" className="size-[1.05rem]" fill="currentColor">
          <path d="m12 2.8 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.6 6.1 20.8l1.2-6.5L2.5 9.7l6.6-.9L12 2.8Z" />
        </svg>
      ))}
    </span>
  );
}

function Card({ r, hidden = false }: { r: (typeof reviews)[number]; hidden?: boolean }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className="relative flex w-[min(82vw,22rem)] shrink-0 flex-col rounded-[1.5rem] border border-bronze/15 bg-cream p-7 sm:w-[24rem]"
    >
      <span data-quote aria-hidden="true" className="block h-14 origin-bottom-left font-display text-[6rem] leading-[0.9] text-bronze/75">
        “
      </span>
      <blockquote className="font-display text-[1.3rem] leading-[1.35] text-ink">{r.text}</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-bronze/10 pt-5 mt-8">
        <span className="grid size-9 place-items-center rounded-full bg-linen text-[0.7rem] font-medium text-bronze-deep">
          {r.by.replace(/[^A-ZÀ-Ú]/g, "").slice(0, 2)}
        </span>
        <span className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted">{r.by} · DOCTORALIA</span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const $ = (s: string) => root.querySelector<HTMLElement>(s)!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // selo de nota
        const badge = $("[data-badge]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: badge, start: "top 85%", once: true, end: "max" } });
        tl.fromTo(badge, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 0)
          .fromTo(badge.querySelectorAll("[data-star]"), { scale: 0, rotate: -80 }, { scale: 1, rotate: 0, duration: 0.9, stagger: 0.07, ease: "back.out(2.4)" }, 0.25)
          .fromTo($("[data-score]"), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1 }, 0.2);
        // aspas
        gsap.fromTo(
          root.querySelectorAll("[data-quote]"),
          { yPercent: 35, rotate: -14, scale: 0.7, opacity: 0 },
          { yPercent: 0, rotate: 0, scale: 1, opacity: 1, duration: 2, stagger: 0.06, scrollTrigger: { trigger: $("[data-marquee]"), start: "top 78%", once: true, end: "max" } },
        );
        // faixa em movimento
        const wrap = $("[data-marquee]");
        const track = $("[data-marquee-track]");
        gsap.fromTo(wrap, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.4, scrollTrigger: { trigger: wrap, start: "top 88%", once: true, end: "max" } });
        const t = gsap.to(track, { xPercent: -50, duration: 72, ease: "none", repeat: -1, paused: true });
        tweenRef.current = t;
        const io = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) t.play();
          else t.pause();
        });
        io.observe(wrap);
        const slow = () => gsap.to(t, { timeScale: 0, duration: 1, ease: "power2.out", overwrite: true });
        const resume = () => gsap.to(t, { timeScale: 1, duration: 1.6, delay: 0.3, overwrite: true });
        wrap.addEventListener("pointerenter", slow);
        wrap.addEventListener("pointerleave", resume);
        wrap.addEventListener("focusin", slow);
        wrap.addEventListener("focusout", resume);
        return () => {
          io.disconnect();
          wrap.removeEventListener("pointerenter", slow);
          wrap.removeEventListener("pointerleave", resume);
          wrap.removeEventListener("focusin", slow);
          wrap.removeEventListener("focusout", resume);
          tweenRef.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const toggle = () => {
    const t = tweenRef.current;
    if (!t) return;
    if (paused) t.play();
    else t.pause();
    setPaused(!paused);
  };

  return (
    <section id="avaliacoes" ref={ref} className="relative overflow-clip bg-ivory section-pad fit-section">
      <FitBox><div className="container-site">
        <Eyebrow n="06">Acolhimento</Eyebrow>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SplitHeading text={reviewsTitle} className="lg:!text-[clamp(2.1rem,min(4.4vw,7svh),4.25rem)]" />
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <a
              data-badge
              data-reveal
              href={clinic.doctoraliaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-6 rounded-[1.75rem] border border-bronze/15 bg-cream px-7 py-5"
            >
              <span data-score className="font-display text-[3.25rem] font-medium leading-[0.82] text-ink">
                {clinic.rating.value}
              </span>
              <span className="flex flex-col gap-2">
                <Stars />
                <span className="text-[0.9rem] text-text">
                  {clinic.rating.count} avaliações no Doctoralia →<span className="sr-only"> (abre em nova aba)</span>
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div data-marquee data-reveal className="mt-14 overflow-hidden lg:mt-[clamp(1.5rem,5svh,3.5rem)]" role="region" aria-label="Avaliações de pacientes">
        <div data-marquee-track className="flex w-max gap-5 pl-5">
          {reviews.map((r, i) => (
            <Card key={`a${i}`} r={r} />
          ))}
          {reviews.map((r, i) => (
            <Card key={`b${i}`} r={r} hidden />
          ))}
        </div>
      </div>

      <div className="container-site mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[40rem] text-[0.875rem] text-muted">{reviewsNote}</p>
        <button
          type="button"
          aria-pressed={paused}
          onClick={toggle}
          className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium text-forest sm:self-auto"
        >
          <span className="grid size-9 place-items-center rounded-full border border-forest/30">
            {paused ? (
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            )}
          </span>
          <span className="sr-only">Pausar o movimento das avaliações</span>
          <span aria-hidden="true">{paused ? "Retomar" : "Pausar"}</span>
        </button>
      </div>
    </FitBox></section>
  );
}
