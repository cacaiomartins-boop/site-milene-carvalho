import { clinic, topics } from "../data/clinic";
import { usePageMeta } from "../motion/meta";
import Hero from "../components/Hero";
import Mirror from "../components/Mirror";
import Manifesto from "../components/Manifesto";
import Themes from "../components/Themes";
import About from "../components/About";
import Process from "../components/Process";
import Office from "../components/Office";
import Reviews from "../components/Reviews";
import Faq from "../components/Faq";
import Contact from "../components/Contact";

export default function Home() {
  usePageMeta(
    "Psicóloga em Brasília e online | Terapia Cognitivo-Comportamental · Milene Carvalho",
    "Milene Carvalho, psicóloga clínica (TCC) em Brasília e online. Atendimento a adultos e casais, inclusive brasileiros que moram no exterior. Converse pelo WhatsApp.",
  );
  return (
    <>
      <Hero />
      <Mirror />
      <Manifesto />
      <Themes />
      <About />
      <Process />
      <Office />
      <Reviews />
      <Faq />
      <Contact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Psychologist", "LocalBusiness"],
            name: `${clinic.name} · Psicóloga`,
            image: clinic.heroPhoto,
            telephone: `+${clinic.whatsapp}`,
            description: "Psicóloga clínica (Terapia Cognitivo-Comportamental) em Brasília e online.",
            address: {
              "@type": "PostalAddress",
              streetAddress: `${clinic.street}, ${clinic.building}`,
              addressLocality: clinic.city,
              addressRegion: clinic.uf,
              postalCode: clinic.cep,
              addressCountry: "BR",
            },
            sameAs: [clinic.doctoraliaUrl],
            knowsAbout: topics.map((t) => t.label),
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5",
              reviewCount: String(clinic.rating.count),
              bestRating: "5",
            },
          }),
        }}
      />
    </>
  );
}
