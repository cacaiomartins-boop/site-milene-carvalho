import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ, ScrollTrigger } from "../motion/setup";
import { faq as data, waLink } from "../data/clinic";
import { Eyebrow, FitBox, Reveal, SplitHeading } from "./ui";
import { WhatsAppButton } from "./WhatsAppButton";

export function AccordionItem({
  n,
  q,
  a,
  open,
  onToggle,
  id,
}: {
  n: number;
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <li data-reveal-item className="border-t border-bronze/25">
      <h3 className="!text-base">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={onToggle}
          className="group flex w-full items-center gap-5 py-7 text-left sm:gap-7 sm:py-8 lg:gap-4 lg:py-[clamp(.7rem,2.1svh,1.5rem)]"
        >
          <span className="w-7 shrink-0 font-display text-[1.1rem] italic text-bronze">{String(n).padStart(2, "0")}</span>
          <span
            className={`flex-1 font-display text-[1.35rem] font-medium leading-[1.25] transition-colors duration-500 ease-silk group-hover:text-forest sm:text-[1.5rem] lg:text-[clamp(1.05rem,2.4svh,1.35rem)] ${
              open ? "text-forest" : "text-ink"
            }`}
          >
            {q}
          </span>
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-700 ease-silk lg:size-9 ${
              open ? "rotate-[135deg] border-forest bg-forest text-ivory" : "border-bronze/35 text-bronze"
            }`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className="grid transition-[grid-template-rows] duration-700 ease-silk"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        inert={!open}
        onTransitionEnd={() => gsap.delayedCall(0.15, () => ScrollTrigger.refresh())}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={`max-w-prose pb-8 pl-12 pr-2 leading-[1.75] text-text transition-all duration-700 ease-silk sm:pl-14 sm:pr-16 lg:pb-[clamp(.8rem,2svh,1.5rem)] lg:pl-11 lg:pr-2 lg:text-[0.95rem] lg:leading-[1.6] ${
              open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            {a}
          </p>
        </div>
      </div>
    </li>
  );
}

export function useOpenSet(initial: number[] = [0]) {
  const [open, setOpen] = useState<number[]>(initial);
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  return { open, toggle };
}

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // só uma resposta aberta por vez: a altura da seção fica estável
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // a lista usa Reveal; nada extra aqui
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <section id="duvidas" ref={ref} className="relative overflow-clip bg-linen section-pad fit-section">
      <FitBox><div className="container-site">
        <Eyebrow n="08">Dúvidas</Eyebrow>
        <div className="mt-2 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div>
              <SplitHeading text={data.title} className="lg:!text-[clamp(2.1rem,min(4.4vw,7svh),4.25rem)]" />
              <Reveal>
                <p className="mt-6 max-w-[26rem] text-text">{data.intro}</p>
                <div className="mt-8">
                  <WhatsAppButton variant="outline" href={waLink(`tenho uma dúvida antes de agendar:`)}>
                    Ainda tenho uma dúvida
                  </WhatsAppButton>
                </div>
              </Reveal>
            </div>
          </div>
          <Reveal as="ul" items stagger={0.07} y={28} start="top 85%" className="border-b border-bronze/25 lg:col-span-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 lg:border-b-0 [&>li:nth-last-child(-n+2)]:lg:border-b [&>li:nth-last-child(-n+2)]:lg:border-bronze/25">
            {data.items.map((it, i) => (
              <AccordionItem key={i} id={`faq-${i}`} n={i + 1} q={it.q} a={it.a} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
            ))}
          </Reveal>
        </div>
      </div></FitBox>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: data.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
          }),
        }}
      />
    </section>
  );
}
