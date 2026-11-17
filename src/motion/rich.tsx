import { Fragment } from "react";

/** Converte "texto *destaque* texto" em texto com <em>. */
export function Rich({ text }: { text: string }) {
  const parts = text.split("*");
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <em key={i}>{p}</em> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}

export function stripRich(text: string) {
  return text.replace(/\*/g, "");
}
