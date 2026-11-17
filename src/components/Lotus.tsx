import gsap from "gsap";

const r1 = (n: number) => Math.round(n * 10) / 10;

function petal(a: number[], b: number[], w: number, w2 = w) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    L = Math.hypot(dx, dy),
    ux = dx / L,
    uy = dy / L,
    nx = -uy;
  const p = (t: number, o: number) => [a[0] + ux * L * t + nx * o, a[1] + uy * L * t + ux * o];
  const c1 = p(0.3, w),
    c2 = p(0.82, 0.62 * w),
    c3 = p(0.82, -0.62 * w2),
    c4 = p(0.3, -w2);
  return (
    `M${r1(a[0])} ${r1(a[1])}C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(b[0])} ${r1(b[1])}` +
    `C${r1(c3[0])} ${r1(c3[1])} ${r1(c4[0])} ${r1(c4[1])} ${r1(a[0])} ${r1(a[1])}Z`
  );
}

const PETALS = [
  petal([300, 352], [300, 12], 110),
  petal([300, 352], [98, 100], 70, 88),
  petal([300, 352], [502, 100], 88, 70),
  petal([300, 368], [8, 248], 50, 118),
  petal([300, 368], [592, 248], 118, 50),
];

interface Props {
  base?: boolean;
  sw?: number;
  className?: string;
}

export function Lotus({ base = true, sw = 1.6, className = "" }: Props) {
  return (
    <svg
      viewBox={base ? "-10 0 620 470" : "-10 0 620 400"}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {PETALS.map((d, i) => (
        <path key={i} className="lotus-petal" vectorEffect="non-scaling-stroke" d={d} />
      ))}
      {base && (
        <>
          <path className="lotus-rule" vectorEffect="non-scaling-stroke" d="M40 438H272" />
          <path className="lotus-rule" vectorEffect="non-scaling-stroke" d="M560 438H328" />
          <circle className="lotus-dot" cx="300" cy="438" r="11" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}

/** Estado inicial (pétalas recolhidas). */
export function lotusReset(root: Element | null) {
  if (!root) return;
  gsap.set(root.querySelectorAll(".lotus-petal"), { drawSVG: "50% 50%" });
  gsap.set(root.querySelectorAll(".lotus-rule"), { drawSVG: "100% 100%" });
  gsap.set(root.querySelectorAll(".lotus-dot"), { scale: 0, transformOrigin: "50% 50%" });
}

/** Anima o lótus "florescendo" dentro de uma timeline. */
export function lotusBloom(
  tl: gsap.core.Timeline,
  root: Element | null,
  at: number | string = 0,
  o: { petal?: number; stagger?: number; ease?: string } = {},
) {
  if (!root) return tl;
  const { petal: dur = 1.2, stagger = 0.12, ease = "power2.inOut" } = o;
  tl.fromTo(
    root.querySelectorAll(".lotus-petal"),
    { drawSVG: "50% 50%" },
    { drawSVG: "0% 100%", duration: dur, stagger, ease },
    at,
  );
  const rules = root.querySelectorAll(".lotus-rule");
  if (rules.length)
    tl.fromTo(rules, { drawSVG: "100% 100%" }, { drawSVG: "0% 100%", duration: dur * 0.75, ease: "breath" }, `-=${dur * 0.5}`);
  const dot = root.querySelectorAll(".lotus-dot");
  if (dot.length)
    tl.fromTo(dot, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.7, ease: "back.out(2)" }, "-=0.4");
  return tl;
}

/** Lótus gigante e fantasma no fundo das seções claras. */
export function GhostLotus({ className = "" }: { className?: string }) {
  return (
    <div
      data-ghost-lotus
      aria-hidden="true"
      className={`pointer-events-none absolute text-forest opacity-[0.07] ${className}`}
    >
      <Lotus base={false} sw={1.2} className="size-full" />
    </div>
  );
}
