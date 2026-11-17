import { clinic, mapDirectionsUrl, office, wazeUrl } from "../data/clinic";
import { Eyebrow, FitBox, Reveal, SplitHeading } from "./ui";
import { MapCard } from "./MapCard";
import { Seal } from "./Seal";
import { WhatsAppButton } from "./WhatsAppButton";
import { Link } from "react-router-dom";
import { ArrowIcon } from "./WhatsAppButton";
import { Video, MapPin, Clock, Check, Leaf } from "lucide-react";

export default function Office() {
  return (
    <section id="consultorio" className="relative overflow-clip bg-cream section-pad fit-section">
      <FitBox>
        <div className="container-site">
          <Eyebrow n="05">Presencial e online</Eyebrow>
          <div className="max-w-[52rem]">
            <SplitHeading text={office.title} className="lg:!text-[clamp(2rem,min(3.6vw,5.8svh),3.4rem)]" />
          </div>

          {/* Linha 1: mapa + presencial */}
          <article className="mt-16 grid gap-10 lg:mt-[clamp(1rem,3.4svh,3rem)] lg:grid-cols-12 lg:items-stretch lg:gap-10">
            <div className="relative lg:col-span-6">
              <MapCard className="lg:!h-full lg:min-h-[12rem]" />
              <Seal
                text={`COMO CHEGAR · ${clinic.district.toUpperCase()} · ${clinic.city.toUpperCase()} · `}
                className="absolute -bottom-8 right-3 w-[7.5rem] sm:-bottom-10 sm:right-6 sm:w-[9rem] lg:-bottom-5 lg:right-5 lg:w-[clamp(4.5rem,12svh,7rem)]"
              />
            </div>
            <Reveal className="mt-4 lg:col-span-6 lg:mt-0">
              <h3 className="text-[1.9rem] font-medium lg:text-[clamp(1.4rem,3.4svh,1.9rem)]">{office.h3}</h3>
              <p className="mt-3 max-w-[38rem] text-text lg:mt-[clamp(.3rem,1svh,.75rem)] lg:text-[clamp(.9rem,2.2svh,1.0625rem)] lg:leading-[1.5]">
                {office.text}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2.5 lg:mt-[clamp(.5rem,1.5svh,1.25rem)]">
                {office.chips.map((c) => (
                  <li key={c} className="flex items-center gap-2 rounded-full border border-bronze/25 bg-ivory px-4 py-2 text-[0.85rem] text-text lg:py-1">
                    <Check className="size-4 text-bronze" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:mt-[clamp(.7rem,2.2svh,1.75rem)] lg:gap-4">
                <div className="flex gap-3">
                  <MapPin className="mt-1 size-5 shrink-0 text-bronze" strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <p className="text-[0.78rem] font-medium uppercase tracking-[0.22em] text-bronze-deep">Endereço</p>
                    <address className="mt-1 not-italic text-text lg:text-[clamp(.88rem,2.1svh,1.0625rem)] lg:leading-[1.45]">
                      {clinic.street}
                      <br />
                      {clinic.building} · {clinic.district}
                      <br />
                      {clinic.city}-{clinic.uf} · CEP {clinic.cep}
                    </address>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="mt-1 size-5 shrink-0 text-bronze" strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <p className="text-[0.78rem] font-medium uppercase tracking-[0.22em] text-bronze-deep">Horários</p>
                    <p className="mt-1 text-text lg:text-[clamp(.88rem,2.1svh,1.0625rem)] lg:leading-[1.45]">{clinic.hours}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 lg:mt-[clamp(.7rem,2.4svh,2rem)]">
                <WhatsAppButton message="presencial" className="lg:!h-11">
                  Agendar no consultório
                </WhatsAppButton>
                <WhatsAppButton variant="outline" icon="arrow" href={mapDirectionsUrl} className="lg:!h-11">
                  Como chegar
                </WhatsAppButton>
                <WhatsAppButton variant="outline" icon="arrow" href={wazeUrl} className="lg:!h-11">
                  Waze
                </WhatsAppButton>
              </div>
            </Reveal>
          </article>

          {/* Linha 2: terapia online (faixa horizontal no desktop) */}
          <Reveal as="aside" className="mt-10 lg:mt-[clamp(1.4rem,4.5svh,3.5rem)]">
            <div className="rounded-[2.5rem] border border-bronze/15 bg-ivory p-7 shadow-soft sm:p-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:rounded-[2rem] lg:p-[clamp(1rem,2.6svh,2rem)]">
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-linen text-forest lg:size-10">
                    <Video className="size-6 lg:size-5" strokeWidth={1.3} aria-hidden="true" />
                  </span>
                  <h3 className="text-[1.9rem] font-medium lg:text-[clamp(1.3rem,3.2svh,1.8rem)]">{office.onlineTitle}</h3>
                </div>
                <p className="mt-3 text-text lg:mt-[clamp(.3rem,1svh,.75rem)] lg:text-[clamp(.88rem,2.1svh,1.0625rem)] lg:leading-[1.5]">
                  {office.onlineText}
                </p>
              </div>
              <ul className="mt-6 space-y-3 lg:col-span-4 lg:mt-0 lg:space-y-[clamp(.2rem,.9svh,.6rem)] lg:text-[clamp(.85rem,2svh,1rem)] lg:leading-[1.4]">
                {office.onlineItems.map((i) => (
                  <li key={i} className="flex gap-3 text-text">
                    <Leaf className="mt-1 size-4 shrink-0 text-bronze" strokeWidth={1.4} aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-6 lg:col-span-4 lg:mt-0">
                <Link
                  to="/terapia/brasileiros-no-exterior"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-sage/30 bg-sage-soft/30 p-5 transition-colors duration-500 hover:bg-sage-soft/50 lg:p-[clamp(.6rem,1.6svh,1rem)]"
                >
                  <span>
                    <span className="block font-display text-[1.35rem] leading-tight text-ink lg:text-[clamp(1.05rem,2.6svh,1.3rem)]">{office.abroadTitle}</span>
                    <span className="mt-1 block text-[0.95rem] text-text lg:text-[clamp(.8rem,1.9svh,.95rem)]">{office.abroadText}</span>
                  </span>
                  <ArrowIcon className="size-5 shrink-0 text-forest transition-transform duration-500 ease-silk group-hover:translate-x-1" />
                </Link>
                <div className="mt-4 lg:mt-[clamp(.5rem,1.4svh,1rem)]">
                  <WhatsAppButton variant="outline" message="online" className="w-full sm:w-auto lg:!h-11">
                    Saber sobre a terapia online
                  </WhatsAppButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </FitBox>
    </section>
  );
}
