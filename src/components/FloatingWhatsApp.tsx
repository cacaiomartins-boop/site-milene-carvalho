import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { WhatsAppIcon, track } from "./WhatsAppButton";
import { waKeyLink } from "../data/clinic";

export function FloatingWhatsApp({ menuOpen }: { menuOpen: boolean }) {
  const [pastHero, setPastHero] = useState(false);
  const [avoid, setAvoid] = useState(false);
  const [footer, setFooter] = useState(false);
  const [dark, setDark] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);

  useEffect(() => {
    const avoidSet = new Set<Element>();
    const ioAvoid = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? avoidSet.add(e.target) : avoidSet.delete(e.target)));
        setAvoid(avoidSet.size > 0);
      },
      { rootMargin: "-66% 0px 0px 0px" },
    );
    const ioFooter = new IntersectionObserver((es) => setFooter(es.some((e) => e.isIntersecting)));
    const darkSet = new Set<Element>();
    const ioDark = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? darkSet.add(e.target) : darkSet.delete(e.target)));
        setDark(darkSet.size > 0);
      },
      { rootMargin: "-90% 0px 0px 0px" },
    );
    const t = window.setTimeout(() => {
      document.querySelectorAll("[data-float-avoid]").forEach((n) => ioAvoid.observe(n));
      document.querySelectorAll("footer").forEach((n) => ioFooter.observe(n));
      document.querySelectorAll('[data-theme="dark"]').forEach((n) => ioDark.observe(n));
    }, 500);
    return () => {
      window.clearTimeout(t);
      ioAvoid.disconnect();
      ioFooter.disconnect();
      ioDark.disconnect();
      setAvoid(false);
      setFooter(false);
      setDark(false);
    };
  }, [pathname]);

  const visible = pastHero && !avoid && !footer && !menuOpen;
  return (
    <a
      href={waKeyLink("general")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("floating")}
      aria-label="Agendar conversa no WhatsApp"
      tabIndex={visible ? 0 : -1}
      className={`group fixed bottom-4 right-4 z-40 flex h-[3.625rem] items-center gap-0 rounded-full px-[1.0rem] shadow-forest transition-all duration-500 ease-silk sm:bottom-6 sm:right-6 lg:h-[3.75rem] ${
        dark ? "bg-ivory text-forest" : "bg-forest text-ivory"
      } ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-500 ease-silk group-hover:mr-3 group-hover:max-w-[10rem] group-hover:opacity-100 group-focus-visible:mr-3 group-focus-visible:max-w-[10rem] group-focus-visible:opacity-100">
        Agendar conversa
      </span>
      <WhatsAppIcon className="size-[1.65rem]" />
    </a>
  );
}
