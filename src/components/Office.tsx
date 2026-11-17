import { clinic, mapDirectionsUrl, office, wazeUrl } from "../data/clinic";
import { Eyebrow, Reveal, SplitHeading } from "./ui";
import { MapCard } from "./MapCard";
import { Seal } from "./Seal";
import { WhatsAppButton } from "./WhatsAppButton";
import { Link } from "react-router-dom";
import { ArrowIcon } from "./WhatsAppButton";
import { Video, MapPin, Clock, Check, Leaf } from "lucide-react";

export default function Office() {
  return (
    <section id="consultorio" className="relative overflow-clip bg-cream section-pad">
      <div className="container-site">
        <Eyebrow n="05">Presencial e online</Eyebrow>
        <div className="max-w-[52rem]">
          <SplitHeading text={office.title} />
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Presencial */}
          <article className="lg:col-span-7">
            <div className="relative">
              <MapCard />
              <Seal
                text={`COMO CHEGAR · ${clinic.district.toUpperCase()} · ${clinic.city.toUpperCase()} · `}
                className="absolute -bottom-8 right-3 w-[7.5rem] sm:-bottom-10 sm:right-6 sm:w-[9rem]"
              />
            </div>
            <Reveal className="mt-14">
              <h3 className="text-[1.9rem] font-medium">{office.h3}</h3>
              <p className="mt-3 max-w-[38rem] text-text">{office.text}</p>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {office.chips.map((c) => (
                  <li key={c} className="flex items-center gap-2 rounded-full border border-bronze/25 bg-ivory px-4 py-2 text-[0.85rem] text-text">
                    <Check className="size-4 text-bronze" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <div className="flex gap-3">
                  <MapPin className="mt-1 size-5 shrink-0 text-bronze" strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <p className="text-[0.78rem] font-medium uppercase tracking-[0.22em] text-bronze-deep">Endereço</p>
                    <address className="mt-1 not-italic text-text">
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
                    <p className="mt-1 text-text">{clinic.hours}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <WhatsAppButton message="presencial">Agendar no consultório</WhatsAppButton>
                <WhatsAppButton variant="outline" icon="arrow" href={mapDirectionsUrl}>
                  Como chegar
                </WhatsAppButton>
                <WhatsAppButton variant="outline" icon="arrow" href={wazeUrl}>
                  Waze
                </WhatsAppButton>
              </div>
            </Reveal>
          </article>

          {/* Online */}
          <Reveal as="aside" className="lg:col-span-5">
            <div className="rounded-[2.5rem] border border-bronze/15 bg-ivory p-7 shadow-soft sm:p-10">
              <span className="grid size-12 place-items-center rounded-full bg-linen text-forest">
                <Video className="size-6" strokeWidth={1.3} aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-[1.9rem] font-medium">{office.onlineTitle}</h3>
              <p className="mt-3 text-text">{office.onlineText}</p>
              <ul className="mt-6 space-y-3">
                {office.onlineItems.map((i) => (
                  <li key={i} className="flex gap-3 text-text">
                    <Leaf className="mt-1 size-4 shrink-0 text-bronze" strokeWidth={1.4} aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
              <Link
                to="/terapia/brasileiros-no-exterior"
                className="group mt-8 flex items-center justify-between gap-4 rounded-2xl border border-sage/30 bg-sage-soft/30 p-5 transition-colors duration-500 hover:bg-sage-soft/50"
              >
                <span>
                  <span className="block font-display text-[1.35rem] leading-tight text-ink">{office.abroadTitle}</span>
                  <span className="mt-1 block text-[0.95rem] text-text">{office.abroadText}</span>
                </span>
                <ArrowIcon className="size-5 shrink-0 text-forest transition-transform duration-500 ease-silk group-hover:translate-x-1" />
              </Link>
              <div className="mt-6">
                <WhatsAppButton variant="outline" message="online" className="w-full sm:w-auto">
                  Saber sobre a terapia online
                </WhatsAppButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
