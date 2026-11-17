import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, scrollToTarget } from "../motion/setup";
import { clinic, nav, topics } from "../data/clinic";
import { Wordmark } from "./Wordmark";
import { HashLink } from "./HashLink";
import { WhatsAppButton } from "./WhatsAppButton";
import { ArrowIcon } from "./WhatsAppButton";

export function Header({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [dd, setDd] = useState(false);
  const [acc, setAcc] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const set = new Set<Element>();
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? set.add(e.target) : set.delete(e.target)));
        setDark(set.size > 0);
      },
      { rootMargin: "0px 0px -94% 0px" },
    );
    const t = window.setTimeout(() => document.querySelectorAll('[data-theme="dark"]').forEach((n) => io.observe(n)), 500);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
      set.clear();
      setDark(false);
    };
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setDd(false);
  }, [pathname, setMenuOpen]);

  // esconde ao descer, mostra ao subir
  useGSAP(
    () => {
      const el = ref.current!;
      const to = gsap.quickTo(el, "yPercent", { duration: 0.6, ease: "silk" });
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (self.scroll() < 160 || el.contains(document.activeElement) || el.dataset.menuOpen === "true") to(0);
          else to(self.direction === 1 ? -140 : 0);
        },
      });
      return () => st.kill();
    },
    { scope: ref },
  );

  const link =
    "u-link whitespace-nowrap text-[0.9rem] xl:text-[0.95rem] text-ink/85 group-data-[tone=dark]/h:text-ivory/85";

  return (
    <>
      <header
        ref={ref}
        data-scrolled={scrolled}
        data-tone={dark ? "dark" : "light"}
        data-menu-open={menuOpen}
        className="group/h fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-[background-color,box-shadow,backdrop-filter] duration-700 ease-silk
          group-data-[scrolled=true]/h:bg-cream/85 group-data-[scrolled=true]/h:backdrop-blur-xl group-data-[scrolled=true]/h:shadow-[0_1px_0_rgba(139,106,71,0.14)]
          group-data-[scrolled=true]/h:group-data-[tone=dark]/h:bg-forest-deep/80 group-data-[scrolled=true]/h:group-data-[tone=dark]/h:shadow-[0_1px_0_rgba(210,189,150,0.18)]
          group-data-[menu-open=true]/h:!bg-cream group-data-[menu-open=true]/h:!text-ink`}
        >
          <div
            className="container-site flex items-center justify-between gap-6 transition-[height] duration-700 ease-silk h-[100px] group-data-[scrolled=true]/h:h-[4.25rem] lg:group-data-[scrolled=true]/h:h-[4.75rem]"
          >
            <Link
              to="/"
              aria-label={`${clinic.name}, ${clinic.role}. Ir para o início`}
              onClick={() => scrollToTarget(0, 0)}
              className="text-forest transition-colors duration-700 group-data-[tone=dark]/h:text-ivory group-data-[menu-open=true]/h:!text-forest"
            >
              <Wordmark />
            </Link>

            <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex xl:gap-8 min-[1400px]:gap-10">
              {nav.map((n) =>
                n.dropdown ? (
                  <div
                    key={n.label}
                    className="relative"
                    onMouseEnter={() => setDd(true)}
                    onMouseLeave={() => setDd(false)}
                    onFocus={() => setDd(true)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) setDd(false);
                    }}
                  >
                    <HashLink to={n.href} className={link} aria-haspopup="true" aria-expanded={dd}>
                      {n.label}
                    </HashLink>
                    <div
                      className={`absolute left-1/2 top-full w-[35rem] -translate-x-1/2 pt-5 transition-all duration-500 ease-silk ${
                        dd ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                      }`}
                    >
                      <div className="rounded-[1.75rem] border border-bronze/15 bg-ivory p-4 text-ink shadow-card">
                        <ul className="grid grid-cols-2 gap-1">
                          {topics.map((t) => (
                            <li key={t.slug}>
                              <Link
                                to={`/terapia/${t.slug}`}
                                className="flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-linen"
                              >
                                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-bronze/25 font-display text-sm italic text-bronze">
                                  {t.number}
                                </span>
                                <span className="font-display text-[1.1rem] leading-tight">{t.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <HashLink
                          to="#como-ajudo"
                          className="mt-2 flex items-center gap-2 border-t border-bronze/15 px-3 pt-4 text-sm text-forest"
                        >
                          Ver todos os temas <ArrowIcon className="size-4" />
                        </HashLink>
                      </div>
                    </div>
                  </div>
                ) : (
                  <HashLink key={n.label} to={n.href} className={`${link} ${n.xlOnly ? "max-xl:!hidden" : ""}`}>
                    {n.label}
                  </HashLink>
                ),
              )}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <div className="group-data-[tone=dark]/h:[&_a]:!bg-ivory group-data-[tone=dark]/h:[&_a]:!text-forest group-data-[tone=dark]/h:[&_a]:!shadow-none">
                  <WhatsAppButton message="header" icon="whatsapp">
                    Agendar conversa
                  </WhatsAppButton>
                </div>
              </div>
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-controls="menu-mobile"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative grid size-11 place-items-center lg:hidden"
              >
                <span
                  className={`absolute h-px w-5 bg-current transition-transform duration-500 ease-silk ${
                    menuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
                  }`}
                />
                <span
                  className={`absolute h-px w-5 bg-current transition-transform duration-500 ease-silk ${
                    menuOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-lenis-prevent
        className={`fixed inset-0 z-40 overflow-y-auto bg-cream pt-[100px] transition-all duration-500 ease-silk lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        inert={!menuOpen}
      >
        <div className="container-site pb-12 pt-6">
          <ul className="divide-y divide-bronze/15 font-display text-[2rem] leading-tight text-ink">
            {nav.map((n) => (
              <li key={n.label} className="py-4">
                {n.dropdown ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={acc}
                      onClick={() => setAcc(!acc)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      {n.label}
                      <ArrowIcon className={`size-6 text-bronze transition-transform duration-500 ease-silk ${acc ? "rotate-90" : ""}`} />
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-500 ease-silk"
                      style={{ gridTemplateRows: acc ? "1fr" : "0fr" }}
                    >
                      <ul className="grid min-h-0 grid-cols-1 gap-x-4 overflow-hidden text-[1.15rem] sm:grid-cols-2">
                        {topics.map((t) => (
                          <li key={t.slug}>
                            <Link to={`/terapia/${t.slug}`} className="block py-2 text-text">
                              {t.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <HashLink to="#como-ajudo" onNavigate={() => setMenuOpen(false)} className="block py-2 text-forest">
                            Ver todos os temas
                          </HashLink>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <HashLink to={n.href} onNavigate={() => setMenuOpen(false)} className="flex items-center justify-between">
                    {n.label}
                    <ArrowIcon className="size-6 text-bronze" />
                  </HashLink>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <WhatsAppButton size="lg" message="header" className="w-full">
              Agendar conversa no WhatsApp
            </WhatsAppButton>
          </div>
          <p className="mt-6 text-sm text-muted">
            {clinic.name} · {clinic.registry}
          </p>
        </div>
      </div>
    </>
  );
}
