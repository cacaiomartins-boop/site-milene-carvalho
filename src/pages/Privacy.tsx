import { clinic, privacyText } from "../data/clinic";
import { usePageMeta } from "../motion/meta";
import { Eyebrow, SplitHeading } from "../components/ui";

export default function Privacy() {
  usePageMeta(`Política de privacidade · ${clinic.name}`, "Como este site trata seus dados, conforme a LGPD.");
  return (
    <section className="bg-cream pb-24 pt-40 sm:pb-32 sm:pt-48">
      <div className="container-site max-w-[52rem]">
        <Eyebrow>Privacidade</Eyebrow>
        <SplitHeading as="h1" text="Política de *privacidade*" className="!text-[clamp(2.6rem,6vw,4.5rem)]" />
        <p className="mt-8 text-text">
          Este site foi feito para facilitar o seu contato com {clinic.name}, {clinic.roleClinical.toLowerCase()} ({clinic.registry}). Aqui está, em
          linguagem simples, como seus dados são tratados.
        </p>
        <div className="mt-12 space-y-10">
          {privacyText.map((s) => (
            <div key={s.h}>
              <h2 className="text-[1.7rem] font-medium">{s.h}</h2>
              <p className="mt-3 text-text">{s.p}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-sm text-muted">Última atualização: novembro de 2026.</p>
      </div>
    </section>
  );
}
