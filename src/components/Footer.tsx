import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, MQ, scrollToTarget } from "../motion/setup";
import { clinic, emergency, footerTopics, mapDirectionsUrl, nav } from "../data/clinic";
import { Rich } from "../motion/rich";
import { Lotus, lotusReset } from "./Lotus";
import { HashLink } from "./HashLink";
import { WhatsAppButton, WhatsAppIcon, ArrowIcon } from "./WhatsAppButton";
import { FitBox } from "./ui";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const $ = (s: string) => root.querySelector<HTMLElement>(s)!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const mobile = window.innerWidth < 640;
        const panel = $("[data-footer-panel]");
        gsap.fromTo(
          panel,
          { clipPath: mobile ? "inset(0% 3% 0% 3% round 3.5rem 3.5rem 0 0)" : "inset(0% 4% 0% 4% round 6rem 6rem 0rem 0rem)" },
          {
            clipPath: mobile ? "inset(0% round 1.75rem 1.75rem 0 0)" : "inset(0% round 2.5rem 2.5rem 0rem 0rem)",
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "clamp(top 30%)", scrub: true },
          },
        );
        const wm = $("[data-wordmark]");
        const lotus = wm.querySelector("[data-wm-lotus]")!;
        lotusReset(lotus);
        gsap
          .timeline({ scrollTrigger: { trigger: wm, start: "top bottom", end: "clamp(bottom bottom)", scrub: 1.2 } })
          .to(lotus.querySelectorAll(".lotus-petal"), { drawSVG: "0% 100%", duration: 0.9, stagger: 0.08, ease: "none" }, 0)
          .to(lotus.querySelectorAll(".lotus-rule"), { drawSVG: "0% 100%", duration: 0.5, ease: "none" }, 0.4)
          .fromTo(wm.querySelectorAll("[data-wm-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power2.out" }, 0.15)
          .fromTo(wm.querySelectorAll("[data-wm-dot]"), { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, 0.3)
          .fromTo(wm.querySelectorAll("[data-wm-char]"), { yPercent: 108 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: "power2.out" }, 0.35);
      });
      mm.add(MQ.fine, () => {
        const b = topRef.current!;
        const xTo = gsap.quickTo(b, "x", { duration: 0.8, ease: "power3.out" });
        const yTo = gsap.quickTo(b, "y", { duration: 0.8, ease: "power3.out" });
        const clamp = (v: number) => Math.max(-12, Math.min(12, v));
        const move = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          xTo(clamp((e.clientX - (r.left + r.width / 2)) * 0.28));
          yTo(clamp((e.clientY - (r.top + r.height / 2)) * 0.35));
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        b.addEventListener("pointermove", move);
        b.addEventListener("pointerleave", leave);
        return () => {
          b.removeEventListener("pointermove", move);
          b.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const label = "text-xs font-medium uppercase tracking-[0.3em] text-gold-soft";
  const link = "inline-block py-1.5 lg:py-0.5 text-ivory/80 transition-colors duration-300 hover:text-ivory";
  const chars = clinic.name.toUpperCase().split("");

  return (
    <footer ref={ref} className="bg-cream pt-10 lg:pt-4">
      <div data-footer-panel data-theme="dark" className="grain relative overflow-hidden bg-forest-night">
        <div className="pointer-events-none absolute -top-24 right-0 h-[30rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(110,150,115,0.25),transparent)]" />
        <div className="container-site relative pb-8 pt-20 lg:pb-5 lg:pt-[clamp(1.5rem,5svh,5rem)]"><FitBox>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-[16ch] font-display text-[clamp(2.2rem,4.4vw,4rem)] font-medium leading-[1.04] text-ivory lg:text-[clamp(1.8rem,min(4.4vw,6svh),4rem)]">
              <Rich text={clinic.tagline} />
            </p>
            <WhatsAppButton variant="light" size="lg" message="header">
              Agendar conversa
            </WhatsAppButton>
          </div>

          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:mt-[clamp(1.2rem,4svh,4rem)] lg:grid-cols-4 lg:gap-8">
            <nav aria-label="Rodapé">
              <h2 className={label + " !font-sans"}>Navegação</h2>
              <ul className="mt-4 space-y-1">
                {nav.map((n) => (
                  <li key={n.label}>
                    <HashLink to={n.href} className={link}>
                      {n.label}
                    </HashLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h2 className={label + " !font-sans"}>Temas</h2>
              <ul className="mt-4 space-y-1">
                {footerTopics.map((t) => (
                  <li key={t.slug}>
                    <Link to={`/terapia/${t.slug}`} className={link}>
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={label + " !font-sans"}>Contato</h2>
              <ul className="mt-4 space-y-1 text-ivory/80">
                <li>
                  <a href={`https://wa.me/${clinic.whatsapp}`} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-2`}>
                    <WhatsAppIcon className="size-4" /> {clinic.whatsappDisplay}
                    <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
                  </a>
                </li>
                <li>
                  {clinic.street}, {clinic.building}
                  <br />
                  {clinic.district}, {clinic.city}-{clinic.uf}
                  <a href={mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className={`${link} mt-1 !flex w-fit items-center gap-1`}>
                    Como chegar <ArrowIcon className="size-4" />
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
                <li>Atendimento com hora marcada</li>
              </ul>
            </div>
            <div>
              <h2 className={label + " !font-sans"}>Atendimento</h2>
              <ul className="mt-4 space-y-1 text-ivory/80">
                <li>Presencial em Brasília</li>
                <li>Online para todo o Brasil</li>
                <li>Online para brasileiros no exterior</li>
                <li>Adultos e casais · particular</li>
              </ul>
            </div>
          </div>

          {/* Wordmark gigante */}
          <div data-wordmark className="mt-16 flex items-center justify-center gap-4 text-gold-soft sm:mt-20 sm:gap-8 lg:mt-[clamp(1rem,3.5svh,4rem)]" aria-hidden="true">
            <span className="hidden flex-1 items-center gap-3 sm:flex">
              <span data-wm-line className="h-px flex-1 origin-left bg-gold-soft/40" />
              <span data-wm-dot className="size-1.5 rounded-full bg-gold-soft" />
            </span>
            <div className="flex items-center gap-3 sm:gap-6">
              <div data-wm-lotus className="w-8 shrink-0 sm:w-[4rem]">
                <Lotus base sw={1.4} className="w-full" />
              </div>
              <div className="flex font-display text-[clamp(1.05rem,4.4vw,5.4rem)] uppercase leading-none tracking-[0.1em] sm:tracking-[0.12em] text-ivory">
                {chars.map((c, i) => (
                  <span key={i} className="overflow-hidden py-[0.1em]">
                    <span data-wm-char className="inline-block">
                      {c === " " ? " " : c}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <span className="hidden flex-1 items-center gap-3 sm:flex">
              <span data-wm-dot className="size-1.5 rounded-full bg-gold-soft" />
              <span data-wm-line className="h-px flex-1 origin-right bg-gold-soft/40" />
            </span>
          </div>

          <p className="mt-12 rounded-full border border-ivory/15 px-5 py-3 text-center text-sm text-ivory/80 lg:mt-[clamp(.8rem,2.6svh,3rem)] lg:py-2">{emergency}</p>

          <div className="mt-8 flex flex-col gap-4 border-t border-ivory/10 pt-6 lg:mt-[clamp(.6rem,2svh,2rem)] lg:pt-4 text-sm text-ivory/70 lg:flex-row lg:items-center lg:justify-between">
            <p>
              {clinic.name} · {clinic.registry}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a href={clinic.registryVerifyUrl} target="_blank" rel="noopener noreferrer" className={link}>
                Verificar registro no {clinic.councilName}<span className="sr-only"> (abre em nova aba)</span>
              </a>
              <Link to="/privacidade" className={link}>
                Política de privacidade
              </Link>
              <span>© {clinic.name} · {new Date().getFullYear()}</span>
            </div>
            <button
              ref={topRef}
              type="button"
              onClick={() => {
                scrollToTarget(0, 0);
                document.getElementById("conteudo")?.focus({ preventScroll: true });
              }}
              className="inline-flex items-center gap-2 self-start rounded-full border border-ivory/25 px-5 py-2.5 text-ivory transition-colors duration-500 hover:bg-ivory hover:text-forest lg:self-auto"
            >
              Voltar ao topo
              <ArrowIcon className="size-4 -rotate-90" />
            </button>
          </div>
        </FitBox></div>
      </div>
    </footer>
  );
}
