import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, MQ } from "../motion/setup";
import { clinic, finalCta } from "../data/clinic";
import { Rich } from "../motion/rich";
import { Lotus, lotusReset } from "./Lotus";
import { MapCard } from "./MapCard";
import { WhatsAppButton, track } from "./WhatsAppButton";
import { FitBox, Reveal } from "./ui";

const modes = ["Presencial", "Online", "Ainda não sei"] as const;
const periods = ["Manhã", "Tarde"] as const;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`min-h-11 rounded-full border px-4 py-2 text-sm lg:min-h-9 lg:py-1 transition-colors duration-500 ease-silk ${
        active ? "border-gold-soft bg-ivory text-forest" : "border-ivory/25 text-ivory/85 hover:border-ivory/60"
      }`}
    >
      {children}
    </button>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<(typeof modes)[number]>("Ainda não sei");
  const [period, setPeriod] = useState<(typeof periods)[number] | "">("");
  const [error, setError] = useState("");

  useGSAP(
    () => {
      const root = ref.current!;
      const $ = (s: string) => root.querySelector<HTMLElement>(s)!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const panel = $("[data-cta-panel]");
        const mobile = window.innerWidth < 640;
        gsap.fromTo(
          panel,
          { clipPath: mobile ? "inset(2.5% 3.5% 1.5% 3.5% round 2.5rem)" : "inset(5% 7% 3% 7% round 4rem)" },
          {
            clipPath: mobile ? "inset(0% round 1.75rem)" : "inset(0% round 2.5rem)",
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "top 22%", scrub: 0.8 },
          },
        );
        gsap.fromTo(
          $("[data-cta-inner]"),
          { y: mobile ? 40 : 90 },
          { y: 0, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "top 22%", scrub: 0.8 } },
        );
        gsap.fromTo(
          root.querySelectorAll("[data-cta-glow]"),
          { yPercent: -12 },
          { yPercent: 12, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1 } },
        );
        const lotus = $("[data-cta-lotus]");
        lotusReset(lotus);
        gsap
          .timeline({ defaults: { ease: "breath" }, scrollTrigger: { trigger: lotus, start: "top 85%", once: true, end: "max" } })
          .to(lotus.querySelectorAll(".lotus-petal"), { drawSVG: "0% 100%", duration: 1.6, stagger: 0.12 }, 0)
          .to(lotus.querySelectorAll(".lotus-rule"), { drawSVG: "0% 100%", duration: 1.2 }, 0.5)
          .to(lotus.querySelectorAll(".lotus-dot"), { scale: 1, duration: 0.8, ease: "back.out(2)" }, 1);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("site") ?? "") !== "") return; // honeypot
    if (name.trim().length < 2) {
      setError("Por favor, informe seu nome.");
      nameRef.current?.focus();
      return;
    }
    setError("");
    const pref =
      mode === "Ainda não sei" ? "Ainda não decidi entre presencial e online." : `Prefiro atendimento ${mode.toLowerCase()}.`;
    const per = period ? ` Prefiro o período da ${period.toLowerCase()}.` : "";
    const msg = `Olá, ${clinic.firstName}! Meu nome é ${name.trim()}. Vim pelo site e gostaria que você me chamasse. ${pref}${per}`;
    track("form");
    window.open(`https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contato" ref={ref} className="fit-section bg-cream px-2.5 py-16 sm:px-4 sm:py-20">
      <div data-cta-panel data-theme="dark" className="grain relative overflow-hidden rounded-[2.5rem] bg-forest-deep">
        <div data-cta-glow className="pointer-events-none absolute -right-20 -top-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(130,165,130,0.32),transparent)]" />
        <div data-cta-glow className="pointer-events-none absolute -bottom-32 -left-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(180,150,100,0.22),transparent)]" />

        <FitBox><div data-cta-inner className="container-site relative grid gap-14 py-20 sm:py-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-[clamp(7.5rem,27svh,13rem)] lg:pt-[clamp(1.5rem,6svh,5rem)]">
          <div className="lg:col-span-7">
            <div data-cta-lotus className="w-20 text-gold-soft">
              <Lotus base sw={1.5} className="w-full" />
            </div>
            <h2 className="mt-8 max-w-[14ch] !text-[clamp(2.3rem,4.4vw,4.25rem)] !leading-[1.02] lg:mt-[clamp(1rem,3svh,2rem)] lg:!text-[clamp(2.1rem,min(4.4vw,7svh),4.25rem)]">
              <Rich text={finalCta.title} />
            </h2>
            <Reveal>
              <p className="mt-6 max-w-[32rem] text-ivory/75 lg:mt-[clamp(.8rem,2.2svh,1.5rem)]">{finalCta.text}</p>
              <div className="mt-8 lg:mt-[clamp(1rem,3svh,2rem)]">
                <WhatsAppButton variant="light" size="lg" message="contato">
                  {finalCta.button}
                </WhatsAppButton>
              </div>
              <p className="mt-5 text-sm text-ivory/70">{finalCta.line}</p>
            </Reveal>
          </div>

          <div data-float-avoid className="rounded-[2rem] border border-ivory/15 bg-ivory/10 p-7 backdrop-blur sm:p-9 lg:col-span-5 lg:p-[clamp(1.25rem,3.4svh,2.25rem)]">
            <h3 className="text-[clamp(1.75rem,2.4vw,2.25rem)] leading-[1.08]">{finalCta.cardTitle}</h3>
            <p className="mt-3 text-[1rem] text-ivory/75 lg:mt-[clamp(.2rem,.8svh,.75rem)]">{finalCta.cardText}</p>
            <form onSubmit={submit} noValidate className="mt-6 space-y-5 lg:mt-[clamp(.8rem,2.4svh,1.5rem)] lg:space-y-[clamp(.6rem,1.9svh,1.25rem)]">
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input type="text" name="site" tabIndex={-1} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="nome" className="mb-2 block text-sm text-ivory/80">
                  Seu nome
                </label>
                <input
                  id="nome"
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                  aria-invalid={!!error}
                  aria-describedby={error ? "nome-erro" : undefined}
                  className="h-12 w-full rounded-full border border-ivory/20 bg-ivory/10 px-5 lg:h-11 text-ivory placeholder:text-ivory/40 focus:border-gold-soft focus:outline-none"
                  placeholder="Como posso te chamar?"
                />
                {error && (
                  <p id="nome-erro" role="alert" className="mt-2 text-sm text-gold-soft">
                    {error}
                  </p>
                )}
              </div>
              <div className="space-y-5 lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-4 lg:space-y-0">
              <div role="radiogroup" aria-label="Prefiro atendimento">
                <p className="mb-2 text-sm text-ivory/80">Prefiro atendimento</p>
                <div className="flex flex-wrap gap-2">
                  {modes.map((m) => (
                    <Chip key={m} active={mode === m} onClick={() => setMode(m)}>
                      {m}
                    </Chip>
                  ))}
                </div>
              </div>
              <div role="radiogroup" aria-label="Melhor período">
                <p className="mb-2 text-sm text-ivory/80">Melhor período</p>
                <div className="flex flex-wrap gap-2">
                  {periods.map((p) => (
                    <Chip key={p} active={period === p} onClick={() => setPeriod(period === p ? "" : p)}>
                      {p}
                    </Chip>
                  ))}
                </div>
              </div>
              </div>
              <button
                type="submit"
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ivory font-medium text-forest shadow-soft lg:h-12 transition-colors duration-500 ease-silk hover:bg-white sm:w-auto sm:px-8"
              >
                Abrir mensagem no WhatsApp
                <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
              </button>
              <p className="text-[0.8rem] leading-snug text-ivory/60">
                Não peço informações sobre a sua saúde por aqui. Seus dados servem apenas para o retorno do contato.{" "}
                <Link to="/privacidade" className="inline-block py-2 underline underline-offset-4">
                  Política de privacidade
                </Link>
              </p>
            </form>
          </div>
          {/* Mapinha no canto */}
          <Reveal className="relative z-10 px-5 pb-8 sm:px-10 lg:absolute lg:bottom-5 lg:right-12 lg:w-[220px] lg:p-0">
            <p className="mb-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-ivory/70 lg:hidden">
              {clinic.street} · {clinic.district}
            </p>
            <MapCard mini className="w-full" />
            <p className="mt-2 hidden text-[0.72rem] text-ivory/70 lg:block">
              {clinic.street} · {clinic.district}
            </p>
          </Reveal>
        </div></FitBox>

      </div>
    </section>
  );
}
