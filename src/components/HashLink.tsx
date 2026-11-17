import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scrollToTarget } from "../motion/setup";

/** Link para uma âncora da home (#sobre etc.) que funciona de qualquer página. */
export function HashLink({
  to,
  children,
  className = "",
  onNavigate,
  ...rest
}: {
  to: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
  [k: string]: unknown;
}) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  return (
    <a
      href={`/${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.();
        if (pathname === "/") {
          // espera o menu fechar e a rolagem destravar
          window.setTimeout(() => scrollToTarget(to), 60);
        } else {
          nav("/");
          window.setTimeout(() => scrollToTarget(to), 500);
        }
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export { Link };
