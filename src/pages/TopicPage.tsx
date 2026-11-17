import { Link, Navigate, useParams } from "react-router-dom";
import { clinic, topics, waTopicLink } from "../data/clinic";
import { usePageMeta } from "../motion/meta";
import { Rich } from "../motion/rich";
import { Eyebrow, Reveal, SplitHeading } from "../components/ui";
import { GhostLotus, Lotus } from "../components/Lotus";
import { WhatsAppButton, ArrowIcon } from "../components/WhatsAppButton";
import { HashLink } from "../components/HashLink";
import { AccordionItem, useOpenSet } from "../components/Faq";
import { TopicIcon } from "../components/icons";

export default function TopicPage() {
  const { slug } = useParams();
  const t = topics.find((x) => x.slug === slug);
  const { open, toggle } = useOpenSet([0]);
  usePageMeta(
    t ? `Terapia para ${t.pageTitle.toLowerCase()} em ${clinic.city} · ${clinic.name}` : clinic.name,
    t?.metaDescription ?? "",
  );
  if (!t) return <Navigate to="/" replace />;
  const others = topics.filter((x) => x.slug !== t.slug);
  const title = `${t.heroTitle[0]} ${t.heroTitle[1]}`;

  return (
    <>
      <section className="relative isolate overflow-clip pb-20 pt-36 sm:pt-44" style={{ background: "linear-gradient(180deg,#f5efe6,#efe6d8)" }}>
        <GhostLotus className="-right-[12%] -top-[6%] -z-10 h-[40rem] w-[50rem]" />
        <div className="container-site">
          <nav aria-label="Você está em" className="text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="u-link">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <HashLink to="#como-ajudo" className="u-link">
                  Como posso ajudar
                </HashLink>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {t.pageTitle}
              </li>
            </ol>
          </nav>
          <div className="mt-10 flex items-center gap-4 text-bronze">
            <span className="grid size-11 place-items-center rounded-full border border-bronze/30 text-forest">
              <TopicIcon slug={t.slug} className="size-5" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.3em]">Psicoterapia · {t.pageTitle}</span>
          </div>
          <SplitHeading
            as="h1"
            text={title}
            className="mt-7 max-w-[14ch] !text-[clamp(2.6rem,7vw,5.5rem)] !leading-[0.98] !mt-7"
          />
          <Reveal className="mt-8 max-w-[38rem]">
            <p className="text-[1.15rem] text-text">{t.intro}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <WhatsAppButton size="lg" icon="arrow" href={waTopicLink(t.label.toLowerCase())}>
                Conversar sobre isso
              </WhatsAppButton>
              <HashLink to="#processo" className="u-link font-medium text-forest">
                Como funciona a terapia
              </HashLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="reconhecer" className="bg-linen section-pad">
        <div className="container-site">
          <Eyebrow n="01">Talvez seja com você</Eyebrow>
          <SplitHeading text="Você pode se reconhecer *em algumas destas frases.*" className="max-w-[16ch]" />
          <Reveal as="ul" items stagger={0.1} y={24} className="mt-14 grid gap-5 md:grid-cols-2">
            {t.recognize.map((r, i) => (
              <li key={i} data-reveal-item className="flex gap-5 rounded-[1.5rem] border border-bronze/15 bg-ivory p-7">
                <span className="font-display text-[1.4rem] italic text-bronze">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[1.45rem] leading-[1.25] text-ink">{r}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="caminhos" className="bg-cream section-pad">
        <div className="container-site">
          <Eyebrow n="02">Como a terapia ajuda</Eyebrow>
          <SplitHeading text="Um caminho *construído com você.*" />
          <Reveal as="ol" items stagger={0.12} className="mt-14 grid gap-8 md:grid-cols-3">
            {t.paths.map((p, i) => (
              <li key={p.title} data-reveal-item className="border-t border-bronze/30 pt-6">
                <span className="font-display text-[3rem] italic leading-none text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[1.6rem] font-medium">{p.title}</h3>
                <p className="mt-2 text-text">{p.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section id={`abordagem-${t.slug}`} data-theme="dark" className="grain dark-glow relative overflow-hidden py-24 sm:py-32">
        <div className="container-site grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Eyebrow n="03">Como eu trabalho</Eyebrow>
            <Reveal>
              <p className="mt-8 font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.2] text-ivory">
                <Rich text={t.approach} />
              </p>
            </Reveal>
          </div>
          <div className="mx-auto w-[min(60%,14rem)] text-gold-soft lg:col-span-4 lg:w-full lg:max-w-[16rem]">
            <Lotus base sw={1.4} className="w-full" />
          </div>
        </div>
      </section>

      <section id={`duvidas-tema-${t.slug}`} className="bg-linen section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow n="04">Dúvidas</Eyebrow>
            <SplitHeading text="Sobre este tema, *talvez você pergunte…*" />
          </div>
          <Reveal as="ul" items stagger={0.07} y={28} className="border-b border-bronze/25 lg:col-span-7">
            {t.faq.map((f, i) => (
              <AccordionItem key={i} id={`tf-${i}`} n={i + 1} q={f.q} a={f.a} open={open.includes(i)} onToggle={() => toggle(i)} />
            ))}
          </Reveal>
        </div>
      </section>

      <section id="outros-temas" className="bg-cream section-pad">
        <div className="container-site">
          <Eyebrow n="05">Outros temas</Eyebrow>
          <SplitHeading text="Outros caminhos *que posso acompanhar.*" />
          <Reveal as="ul" items stagger={0.08} y={24} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug} data-reveal-item>
                <Link
                  to={`/terapia/${o.slug}`}
                  className="group flex items-center gap-4 rounded-[1.5rem] border border-bronze/15 bg-ivory p-5 transition-shadow duration-500 hover:shadow-card"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-linen text-forest">
                    <TopicIcon slug={o.slug} className="size-5" />
                  </span>
                  <span className="flex-1 font-display text-[1.3rem] leading-tight text-ink">{o.label}</span>
                  <ArrowIcon className="size-5 text-bronze transition-transform duration-500 ease-silk group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section data-theme="dark" className="grain dark-glow relative overflow-hidden py-24 sm:py-32">
        <div className="container-site text-center">
          <div className="mx-auto w-20 text-gold-soft">
            <Lotus base sw={1.5} className="w-full" />
          </div>
          <h2 className="mx-auto mt-8 max-w-[18ch] !text-[clamp(2.2rem,4.4vw,4rem)] !leading-[1.04]">
            Dar o primeiro passo <em>pode ser só uma mensagem.</em>
          </h2>
          <div className="mt-10 flex justify-center" data-float-avoid>
            <WhatsAppButton variant="light" size="lg" href={waTopicLink(t.label.toLowerCase())}>
              Enviar uma mensagem
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
