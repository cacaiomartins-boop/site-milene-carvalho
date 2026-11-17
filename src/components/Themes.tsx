import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, MQ } from "../motion/setup";
import { topics } from "../data/clinic";
import { Rich } from "../motion/rich";
import { Eyebrow, SplitHeading } from "./ui";
import { GhostLotus, Lotus, lotusReset } from "./Lotus";
import { WhatsAppButton, ArrowIcon } from "./WhatsAppButton";
import { TopicIcon } from "./icons";

const pad = (n: number) => String(n).padStart(2, "0");

function Digits({ value }: { value: number }) {
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  const col = (d: number, k: string) => (
    <span className="reel-digit" aria-hidden="true">
      <span data-digit={k} style={{ transform: `translateY(-${d * 10}%)` }}>
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i}>{i}</i>
        ))}
      </span>
    </span>
  );
  return (
    <span className="inline-flex font-display text-[1.4rem] italic text-bronze tabular-nums">
      {col(tens, "tens")}
      {col(ones, "ones")}
    </span>
  );
}

export default function Themes() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const total = topics.length;

  useGSAP(
    () => {
      const root = ref.current!;
      const $ = (s: string) => root.querySelector<HTMLElement>(s)!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);
      const list = listRef.current!;
      const tens = $('[data-digit="tens"]');
      const ones = $('[data-digit="ones"]');
      const bar = $("[data-reel-bar]");
      const setIndex = (n: number) => {
        n = Math.max(1, Math.min(total, n));
        tens.style.transform = `translateY(-${Math.floor(n / 10) * 10}%)`;
        ones.style.transform = `translateY(-${(n % 10) * 10}%)`;
        gsap.set(bar, { scaleX: 1 / total + (1 - 1 / total) * ((n - 1) / (total - 1)) });
      };
      const mm = gsap.matchMedia();

      const revealCard = (card: HTMLElement, delay = 0) => {
        const art = card.querySelector("article")!;
        const inner = card.querySelector("[data-card-inner]")!;
        const tl = gsap.timeline({ delay });
        tl.fromTo(art, { clipPath: "circle(0% at 50% 100%)" }, { clipPath: "circle(140% at 50% 100%)", duration: 1.9, ease: "power3.inOut" }, 0)
          .fromTo(inner, { scale: 1.1, transformOrigin: "50% 100%" }, { scale: 1, duration: 2.1 }, 0);
        const lot = card.querySelector("[data-final-lotus]");
        if (lot) {
          tl.to(lot.querySelectorAll(".lotus-petal"), { drawSVG: "0% 100%", duration: 1.5, stagger: 0.1 }, 0.4)
            .to(lot.querySelectorAll(".lotus-dot"), { scale: 1, duration: 1.2, ease: "back.out(2)" }, 1)
            .to(lot.querySelectorAll(".lotus-rule"), { drawSVG: "0% 100%", duration: 1.2 }, 1)
            .fromTo(card.querySelectorAll("[data-final-item]"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.5);
        }
        return tl;
      };

      // marca-d'água do card: redesenha ao entrar com o ponteiro
      mm.add(MQ.fine, () => {
        const offs: (() => void)[] = [];
        cards.forEach((c) => {
          const wm = c.querySelector("[data-watermark]");
          if (!wm) return;
          lotusReset(wm);
          const enter = () => {
            gsap.fromTo(
              wm.querySelectorAll(".lotus-petal"),
              { drawSVG: "50% 50%" },
              { drawSVG: "0% 100%", duration: 1.6, stagger: 0.09, ease: "breath", overwrite: true },
            );
            gsap.set(wm.querySelectorAll(".lotus-dot"), { scale: 1 });
          };
          c.addEventListener("pointerenter", enter);
          offs.push(() => c.removeEventListener("pointerenter", enter));
        });
        return () => offs.forEach((f) => f());
      });

      /* ---------- Desktop: trilho horizontal preso pela rolagem ---------- */
      mm.add(MQ.desktop, () => {
        root.dataset.reel = "on";
        const track = $("[data-track]");
        const head = $("[data-reel-head]");
        const dist = () => Math.max(0, track.offsetWidth - window.innerWidth);
        setIndex(1);
        cards.forEach((c) => gsap.set(c.querySelector("article"), { clipPath: "circle(0% at 50% 100%)" }));

        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => "+=" + 0.8 * dist(),
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: () => {
              const n = cards.filter((c, i) => i < total && c.getBoundingClientRect().left < window.innerWidth * 0.58).length;
              setIndex(n);
              track.dataset.moving = "";
              window.clearTimeout((track as unknown as { _t: number })._t);
              (track as unknown as { _t: number })._t = window.setTimeout(() => delete track.dataset.moving, 200);
              list.toggleAttribute("data-moving", true);
              window.setTimeout(() => list.removeAttribute("data-moving"), 200);
            },
          },
        });
        gsap.to(head, {
          xPercent: 20,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: head, containerAnimation: tween, start: "left 20%", end: "right 0%", scrub: true },
        });

        const shown = new Set<HTMLElement>();
        cards.forEach((c) => {
          ScrollTrigger_create(c, tween, () => {
            if (shown.has(c)) return;
            shown.add(c);
            revealCard(c);
          });
        });
        // cards já visíveis ao entrar, em sequência
        const initial = cards.filter((c) => c.getBoundingClientRect().left < window.innerWidth * 0.9);
        initial.forEach((c, i) => {
          if (shown.has(c)) return;
          shown.add(c);
          revealCard(c, 0.15 + 0.16 * i);
        });

        const onFocus = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
          const st = tween.scrollTrigger;
          if (!card || !st) return;
          const idx = cards.indexOf(card);
          const targetX = card.offsetLeft + card.offsetWidth / 2 - window.innerWidth / 2;
          const prog = Math.max(0, Math.min(1, targetX / (dist() || 1)));
          const y = st.start + (st.end - st.start) * prog;
          if (idx >= 0) {
            if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 });
            else window.scrollTo({ top: y });
          }
        };
        list.addEventListener("focusin", onFocus);
        return () => {
          list.removeEventListener("focusin", onFocus);
          delete root.dataset.reel;
          cards.forEach((c) => gsap.set(c.querySelector("article"), { clearProps: "clipPath" }));
        };
      });

      /* ---------- Mobile / tablet: rolagem horizontal nativa ---------- */
      mm.add(MQ.notDesktop, () => {
        setIndex(1);
        const cardW = () => (cards[0]?.offsetWidth ?? 300) + 20;
        const update = () => {
          const i = Math.round(list.scrollLeft / cardW()) + 1;
          setIndex(i);
          setAtStart(list.scrollLeft < 8);
          setAtEnd(list.scrollLeft + list.clientWidth >= list.scrollWidth - 8);
        };
        list.addEventListener("scroll", update, { passive: true });
        update();
        cards.forEach((c, i) => {
          const art = c.querySelector("article")!;
          gsap.set(art, { clipPath: "circle(0% at 50% 100%)" });
          ScrollTriggerOnce(c, () => revealCard(c, 0.14 * Math.min(i, 3)));
        });
        const prev = $("[data-prev]");
        const next = $("[data-next]");
        const go = (dir: number) => list.scrollBy({ left: dir * cardW(), behavior: "smooth" });
        const onPrev = () => go(-1);
        const onNext = () => go(1);
        prev.addEventListener("click", onPrev);
        next.addEventListener("click", onNext);
        return () => {
          list.removeEventListener("scroll", update);
          prev.removeEventListener("click", onPrev);
          next.removeEventListener("click", onNext);
          cards.forEach((c) => gsap.set(c.querySelector("article"), { clearProps: "clipPath" }));
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="como-ajudo" ref={ref} className="relative overflow-clip bg-cream py-24 sm:py-32 lg:py-40">
      <GhostLotus className="-bottom-24 -right-24 h-[34rem] w-[44rem]" />
      <div data-track className="relative">
        <div data-reel-head className="container-site mb-12 max-w-[82rem] lg:mb-0 lg:w-[34rem] lg:max-w-none lg:shrink-0 lg:px-0">
          <Eyebrow n="02">Como posso ajudar</Eyebrow>
          <SplitHeading text="Um espaço para compreender o que se repete *e construir outros caminhos.*" className="!text-[clamp(2.25rem,3.3vw,3.4rem)] !leading-[1.04]" />
          <p className="mt-6 max-w-[30rem] text-text">
            Cada pessoa chega com uma história. Estes são alguns dos temas que acompanho, na terapia individual e de casal.
          </p>
        </div>

        <ul
          ref={listRef}
          data-card-list
          className="no-scrollbar flex snap-x gap-5 overflow-x-auto px-5 pb-8 sm:px-10"
        >
          {topics.map((t) => (
            <li key={t.slug} data-card className="@container relative h-[33rem] w-[min(84vw,22rem)] shrink-0 snap-start lg:w-[24rem]">
              <article className="group/card relative h-full overflow-hidden rounded-t-[50cqw] rounded-b-[2rem] bg-ivory shadow-card">
                <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 60% at 50% 0%, #ece4d6, transparent)" }} />
                <div className="pointer-events-none absolute inset-2.5 rounded-t-[50cqw] rounded-b-[1.6rem] border border-bronze/15" />
                <div data-card-inner className="relative flex h-full flex-col items-center px-6 pb-7 pt-11 text-center sm:px-8">
                  <span data-card-num className="font-display text-[2.9rem] italic leading-none text-bronze">
                    {t.number}
                  </span>
                  <span className="mt-4 text-forest">
                    <TopicIcon slug={t.slug} className="size-7" />
                  </span>
                  <span className="mt-4 text-[0.78rem] font-medium uppercase tracking-[0.22em] text-bronze-deep">{t.label}</span>
                  <h3 className="mt-3 text-[1.65rem] font-medium leading-[1.1]">
                    <Rich text={t.question} />
                  </h3>
                  <p className="mt-3 text-[1rem] leading-[1.55] text-text">{t.description}</p>
                  <div className="mt-auto w-full pt-5">
                    <div className="mb-4 flex items-center justify-center gap-3 text-bronze/45" aria-hidden="true">
                      <span className="h-px w-10 bg-current" />
                      <span className="size-1 rounded-full bg-current" />
                      <span className="h-px w-10 bg-current" />
                    </div>
                    <WhatsAppButton variant="outline" text={`me identifiquei com o tema ${t.label.toLowerCase()}. Gostaria de agendar um horário.`} className="w-full" size="md">
                      {t.button}
                    </WhatsAppButton>
                    <Link
                      to={`/terapia/${t.slug}`}
                      className="u-link mt-3 inline-flex items-center gap-2 text-sm font-medium text-forest"
                    >
                      Saiba mais <ArrowIcon className="size-4" />
                    </Link>
                  </div>
                  <div
                    data-watermark
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-6 left-1/2 w-40 -translate-x-1/2 text-bronze opacity-0 transition-opacity duration-700 ease-silk group-hover/card:opacity-[0.13]"
                  >
                    <Lotus base={false} sw={1.2} className="w-full" />
                  </div>
                </div>
              </article>
            </li>
          ))}

          <li data-card className="@container relative h-[33rem] w-[min(84vw,22rem)] shrink-0 snap-start lg:w-[24rem]">
            <article className="relative h-full overflow-hidden rounded-t-[50cqw] rounded-b-[2rem] bg-linen shadow-card">
              <div data-card-inner className="relative flex h-full flex-col items-center px-6 pb-8 pt-12 text-center sm:px-8">
                <div data-final-lotus className="w-24 text-bronze">
                  <Lotus base sw={1.4} className="w-full" />
                </div>
                <h3 data-final-item className="mt-6 text-[1.65rem] font-medium leading-[1.1]">
                  Não encontrou o seu <em>tema aqui?</em>
                </h3>
                <p data-final-item className="mt-4 text-text">
                  Cada história é única. Me conte o que está acontecendo e eu te digo, com sinceridade, se posso ajudar.
                </p>
                <div data-final-item className="mt-auto w-full pt-6">
                  <WhatsAppButton message="general" className="w-full">
                    Conversar pelo WhatsApp
                  </WhatsAppButton>
                </div>
              </div>
            </article>
          </li>
        </ul>
      </div>

        <div data-reel-counter className="container-site mt-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Digits value={1} />
            <span className="font-display text-[1.4rem] italic text-bronze">/ {pad(total)}</span>
          </div>
          <div className="h-px flex-1 bg-bronze/20 lg:max-w-[18rem]">
            <div data-reel-bar className="h-px origin-left bg-bronze" style={{ transform: `scaleX(${1 / total})` }} />
          </div>
          <div data-mobile-ctrl className="flex gap-2 lg:hidden [[data-reel=on]_&]:hidden">
            <button
              data-prev
              type="button"
              aria-label="Tema anterior"
              aria-disabled={atStart}
              className="grid size-11 rotate-180 place-items-center rounded-full border border-bronze/35 text-bronze aria-disabled:opacity-40"
            >
              <ArrowIcon className="size-5" />
            </button>
            <button
              data-next
              type="button"
              aria-label="Próximo tema"
              aria-disabled={atEnd}
              className="grid size-11 place-items-center rounded-full border border-bronze/35 text-bronze aria-disabled:opacity-40"
            >
              <ArrowIcon className="size-5" />
            </button>
          </div>
        </div>
    </section>
  );
}

import { ScrollTrigger } from "gsap/ScrollTrigger";
function ScrollTrigger_create(el: HTMLElement, containerAnimation: gsap.core.Tween, onEnter: () => void) {
  ScrollTrigger.create({ trigger: el, containerAnimation, start: "left 90%", once: true, onEnter });
}
function ScrollTriggerOnce(el: HTMLElement, onEnter: () => void) {
  ScrollTrigger.create({ trigger: el, start: "top 82%", end: "max", once: true, onEnter });
}
