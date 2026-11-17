import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ } from "../motion/setup";
import { about, clinic, waKeyLink } from "../data/clinic";
import { Counter, Eyebrow, ImageReveal, Reveal, SplitHeading } from "./ui";
import { GhostLotus } from "./Lotus";
import { Seal } from "./Seal";
import { WhatsAppButton } from "./WhatsAppButton";

export default function About() {
  const statRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          statRef.current,
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 1.3, delay: 0.35, scrollTrigger: { trigger: statRef.current, start: "top 90%", once: true, end: "max" } },
        );
      });
      return () => mm.revert();
    },
    { scope: statRef },
  );

  return (
    <section
      id="sobre"
      className="relative overflow-x-clip section-pad"
      style={{ background: "linear-gradient(180deg, #fbf9f4 0%, #fbf9f4 30%, #f5efe6 100%)" }}
    >
      <GhostLotus className="-left-32 top-10 h-[40rem] w-[50rem]" />
      <div className="container-site relative">
        <Eyebrow n="03">Quem vai caminhar com você</Eyebrow>
        <div className="mt-14 grid items-center gap-20 lg:grid-cols-2 lg:gap-16">
          {/* Conjunto visual */}
          <div className="@container relative mx-auto w-full max-w-[30rem] pb-10 lg:mx-0">
            <ImageReveal
              src={clinic.aboutPhoto}
              alt={`${clinic.name}, sorrindo, em seu consultório`}
              width={640}
              height={640}
              position="72% 30%"
              className="aspect-[4/5] rounded-t-[50cqw] rounded-b-[2rem] bg-sand shadow-card"
            />
            <div className="pointer-events-none absolute inset-0 rounded-t-[50cqw] rounded-b-[2rem] ring-1 ring-inset ring-white/25" />
            <Seal text={about.sealText} className="absolute -bottom-2 -left-6 w-[8.5rem] sm:-left-10 sm:w-[10rem]" />
            <div
              ref={statRef}
              data-reveal
              className="absolute -bottom-2 -right-2 rounded-[1.5rem] border border-white/60 bg-ivory/75 px-4 py-3.5 shadow-soft backdrop-blur-xl sm:-right-8 sm:px-6 sm:py-5"
            >
              <div className="flex items-baseline gap-3">
                <Counter to={clinic.rating.count} className="font-display text-[2.4rem] font-medium leading-[0.9] tabular-nums text-bronze sm:text-[3.6rem]" />
              </div>
              <p className="mt-1 max-w-[11rem] text-[0.875rem] leading-snug text-ink sm:text-[0.98rem]">{about.statLabel}</p>
              <p className="font-display text-sm italic text-muted">consultas verificadas</p>
            </div>
          </div>

          {/* Texto */}
          <div>
            <SplitHeading text={about.title} className="!mt-0" />
            <Reveal items className="mt-8 space-y-5 text-[1.0625rem] leading-[1.75]">
              {about.paragraphs.map((p, i) => (
                <p key={i} data-reveal-item>
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal items stagger={0.1} y={24} className="mt-10 divide-y divide-bronze/20 border-y border-bronze/20">
              {about.facts.map((f) => (
                <div key={f.label} data-reveal-item className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="text-xs font-medium uppercase tracking-[0.22em] text-bronze-deep">{f.label}</dt>
                  <dd className="text-text">{f.value}</dd>
                </div>
              ))}
              <div data-reveal-item className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-xs font-medium uppercase tracking-[0.22em] text-bronze-deep">Registro profissional</dt>
                <dd className="text-text">
                  {clinic.registry}{" "}
                  <a
                    href={clinic.registryVerifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-link ml-2 text-forest"
                  >
                    Verificar no Cadastro Nacional<span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </dd>
              </div>
            </Reveal>
            <Reveal className="mt-10">
              <WhatsAppButton size="lg" message="sobre">
                {about.button}
              </WhatsAppButton>
            </Reveal>
          </div>
        </div>
      </div>
      <span className="hidden">{waKeyLink("sobre")}</span>
    </section>
  );
}
