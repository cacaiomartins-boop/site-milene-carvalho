import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ } from "../motion/setup";
import { waKeyLink, waLink, type WaKey } from "../data/clinic";

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.88 2.4 1 2.56c.12.17 1.73 2.64 4.2 3.7.59.26 1.05.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function track(label: string) {
  try {
    window.dataLayer?.push({ event: "whatsapp_click", label });
    window.gtag?.("event", "whatsapp_click", { label });
    window.fbq?.("track", "Contact");
  } catch {
    /* sem rastreio */
  }
}

const variants = {
  primary: "bg-forest text-ivory shadow-forest hover:bg-forest-deep",
  outline: "border border-forest/40 text-forest hover:border-forest hover:bg-forest hover:text-ivory",
  light: "bg-ivory text-forest shadow-soft hover:bg-white",
  ghost: "text-forest underline decoration-forest/30 underline-offset-[6px] hover:decoration-forest",
};
const sizes = {
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-7 text-[1.02rem] sm:h-[3.75rem] sm:px-8",
};

interface Props {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  icon?: "whatsapp" | "arrow";
  message?: WaKey;
  href?: string;
  text?: string; // mensagem livre (sem "Olá, Milene!")
  className?: string;
  children: ReactNode;
  external?: boolean;
  onClick?: () => void;
}

export function WhatsAppButton({
  variant = "primary",
  size = "md",
  icon = "whatsapp",
  message = "general",
  href,
  text,
  className = "",
  children,
  external = true,
  onClick,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const url = href ?? (text ? waLink(text) : waKeyLink(message));
  const isWa = !href || href.includes("wa.me");

  useGSAP(
    () => {
      if (variant === "ghost") return;
      const mm = gsap.matchMedia();
      mm.add(MQ.fine, () => {
        const el = ref.current!;
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <a
      ref={ref}
      href={url}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => {
        if (isWa) track(String(message));
        onClick?.();
      }}
      className={`inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full font-medium tracking-[0.01em] transition-[color,background-color,border-color,box-shadow] duration-500 ease-silk ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {icon === "whatsapp" ? <WhatsAppIcon className="size-[1.15em]" /> : null}
      <span>{children}</span>
      {icon === "arrow" ? <ArrowIcon className="size-[1.15em]" /> : null}
      {external && <span className="sr-only"> {isWa ? "(abre o WhatsApp em nova aba)" : "(abre em nova aba)"}</span>}
    </a>
  );
}
