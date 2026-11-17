import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ, ScrollTrigger } from "../motion/setup";
import { faq as data, waLink } from "../data/clinic";
import { Eyebrow, Reveal, SplitHeading } from "./ui";
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
          className="group flex w-full items-center gap-5 py-7 text-left sm:gap-7 sm:py-8"
        >
          <span className="w-7 shrink-0 font-display text-[1.1rem] italic text-bronze">{String(n).padStart(2, "0")}</span>
          <span
            className={`flex-1 font-display text-[1.35rem] font-medium leading-[1.25] transition-colors duration-500 ease-silk group-hover:text-forest sm:text-[1.5rem] ${
              open ? "text-forest" : "text-ink"
            }`}
          >
            {q}
          </span>
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-700 ease-silk ${
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
            className={`max-w-prose pb-8 pl-12 pr-2 leading-[1.75] text-text transition-all duration-700 ease-silk sm:pl-14 sm:pr-16 ${
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
  const { open, toggle } = useOpenSet([0]);
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
    <section id="duvidas" ref={ref} className="relative overflow-clip bg-linen section-pad">
      <div className="container-site">
        <Eyebrow n="08">Dúvidas</Eyebrow>
        <div className="mt-2 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SplitHeading text={data.title} />
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
          <Reveal as="ul" items stagger={0.07} y={28} start="top 85%" className="border-b border-bronze/25 lg:col-span-7">
            {data.items.map((it, i) => (
              <AccordionItem key={i} id={`faq-${i}`} n={i + 1} q={it.q} a={it.a} open={open.includes(i)} onToggle={() => toggle(i)} />
            ))}
          </Reveal>
        </div>
      </div>
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
