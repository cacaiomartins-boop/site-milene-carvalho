import { useRef, useState, type ReactElement } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ } from "../motion/setup";
import { clinic, mapEmbedUrl, mapDirectionsUrl, wazeUrl } from "../data/clinic";
import { Lotus } from "./Lotus";

const XS = [-140, 110, 250, 545, 690, 940];
const YS = [-140, 70, 190, 300, 420, 540, 740];

function Blocks() {
  const out: ReactElement[] = [];
  for (let i = 0; i < XS.length - 1; i++) {
    for (let j = 0; j < YS.length - 1; j++) {
      if (i === 3 && j === 1) continue;
      const x0 = XS[i] + 11,
        x1 = XS[i + 1] - 11,
        y0 = YS[j] + 11,
        y1 = YS[j + 1] - 11;
      const tone = (i + j) % 3 === 0 ? "cream" : "sand";
      const cls = (t: string) => (t === "cream" ? "fill-cream/80" : "fill-sand/45");
      if (x1 - x0 > 200) {
        const half = (x1 - x0) / 2;
        const other = tone === "cream" ? "sand" : "cream";
        out.push(
          <rect key={`${i}-${j}a`} data-map-block x={x0} y={y0} width={half - 10} height={y1 - y0} rx={10} className={cls(tone)} />,
          <rect key={`${i}-${j}b`} data-map-block x={x0 + half + 10} y={y0} width={half - 10} height={y1 - y0} rx={10} className={cls(other)} />,
        );
      } else {
        out.push(<rect key={`${i}-${j}`} data-map-block x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={10} className={cls(tone)} />);
      }
    }
  }
  return <>{out}</>;
}

function MapSvg({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" strokeLinecap="round" className="absolute inset-0 size-full" aria-hidden="true">
      <rect width="800" height="600" className="fill-linen" />
      <g transform="rotate(-9 400 300)">
        <Blocks />
        <rect x="556" y="81" width="123" height="98" rx="22" className="fill-sage-soft/55" data-map-block />
        {[
          [584, 108, 9],
          [611, 128, 12],
          [646, 104, 8],
          [655, 150, 10],
          [590, 152, 7],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} className="fill-sage/20" data-map-block />
        ))}
        {[70, 190, 420, 540].map((y) => (
          <path key={`h${y}`} data-map-street d={`M-140 ${y}H940`} className="stroke-bronze/35" strokeWidth="1.6" />
        ))}
        {[110, 250, 545, 690].map((x) => (
          <path key={`v${x}`} data-map-street d={`M${x} -140V740`} className="stroke-bronze/35" strokeWidth="1.6" />
        ))}
        <path data-map-street d="M-140 300H940" className="stroke-bronze/55" strokeWidth="2.4" />
        <path data-map-route d="M-140 300H400" className="stroke-forest/55" strokeWidth="3.2" />
        <text
          data-map-label
          x="150"
          y="291"
          fontSize="12"
          fontWeight="500"
          letterSpacing="0.22em"
          className="fill-bronze-deep/80 stroke-linen"
          strokeWidth="5"
          paintOrder="stroke"
          style={{ textTransform: "uppercase", fontFamily: "var(--font-sans)" }}
        >
          {clinic.mapStreetLabel}
        </text>
        <text
          data-map-label
          x="490"
          y="470"
          textAnchor="middle"
          fontSize="36"
          fontStyle="italic"
          className="fill-bronze/60 stroke-linen"
          strokeWidth="5"
          paintOrder="stroke"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {clinic.district}
        </text>
      </g>
      <path data-map-river d="M-40 236C90 220 170 200 260 202S420 188 500 178S690 156 860 116" className="stroke-sage-soft/80" strokeWidth="15" />
      <path data-map-river d="M-40 236C90 220 170 200 260 202S420 188 500 178S690 156 860 116" className="stroke-sage/35" strokeWidth="1.4" />
      <path data-map-avenue id={`av-${id}`} d="M-40 520C80 492 160 470 240 438S360 380 420 330S560 215 660 172S800 122 860 112" className="stroke-sand" strokeWidth="21" />
      <path data-map-avenue d="M-40 520C80 492 160 470 240 438S360 380 420 330S560 215 660 172S800 122 860 112" className="stroke-ivory" strokeWidth="15" />
      <text data-map-label fontSize="11" fontWeight="500" letterSpacing="0.24em" dy="4" className="fill-bronze-deep/75" style={{ textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>
        <textPath href={`#av-${id}`} startOffset="19%">
          {clinic.mapAvenueLabel}
        </textPath>
      </text>
      <g transform="translate(742 84)">
        <circle r="19" className="fill-ivory/60 stroke-bronze/35" />
        <path d="M0 -13L4 4L0 1L-4 4Z" className="fill-bronze/70" />
        <text y="-26" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-bronze-deep" style={{ fontFamily: "var(--font-sans)" }}>
          N
        </text>
      </g>
    </svg>
  );
}

export function MapCard({ mini = false, className = "" }: { mini?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const id = "m" + (mini ? "i" : "f");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current!;
        const $$ = (s: string) => gsap.utils.toArray<SVGElement>(s, el);
        const inner = el.querySelector("[data-map-inner]")!;

        if (!mini) {
          const mobile = window.innerWidth < 1024;
          gsap.fromTo(
            el,
            { clipPath: mobile ? "inset(9% 5% 0% 5% round 3rem)" : "inset(16% 7% 0% 7% round 4rem)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 2rem)",
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: mobile ? "top 45%" : "top 30%", scrub: 1 },
            },
          );
          gsap.fromTo(inner, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: mobile ? "top 45%" : "top 30%", scrub: 1 } });
        }

        const tl = gsap.timeline({ defaults: { ease: "breath" }, scrollTrigger: { trigger: el, start: "top 72%", once: true, end: "max" } });
        const k = mini ? 0.5 : 1;
        tl.fromTo($$("[data-map-block]"), { opacity: 0 }, { opacity: 1, duration: 1.4 * k, stagger: { each: 0.025 * k, from: "center" } }, 0)
          .fromTo($$("[data-map-river]"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 2.6 * k }, 0)
          .fromTo($$("[data-map-street]"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 2 * k, stagger: 0.08 * k }, 0.15 * k)
          .fromTo($$("[data-map-avenue]"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 2.2 * k }, 0.45 * k)
          .fromTo($$("[data-map-route]"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.5 * k }, 1.2 * k)
          .fromTo($$("[data-map-label]"), { opacity: 0 }, { opacity: 1, duration: 1.2 * k, stagger: 0.12, ease: "silk" }, 1.3 * k)
          .fromTo(el.querySelector("[data-map-pin]"), { opacity: 0, y: -34, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "back.out(2)" }, 2.3 * k)
          .fromTo(el.querySelector("[data-map-dot]"), { scale: 0 }, { scale: 1, duration: 0.7, ease: "back.out(2)" }, 2.4 * k);
        const tag = el.querySelector("[data-map-tag]");
        if (tag) tl.fromTo(tag, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 1, ease: "silk" }, 2.6 * k);

        const ring = gsap.fromTo(
          el.querySelector("[data-map-ring]"),
          { scale: 0.6, opacity: 0.55 },
          { scale: 2.4, opacity: 0, duration: 2.6, ease: "power2.out", repeat: -1, repeatDelay: 0.5, paused: true },
        );
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? ring.play() : ring.pause()));
        io.observe(el);
        return () => io.disconnect();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-linen shadow-card ${
        mini ? "h-40 rounded-[1.25rem] border border-white/60 lg:h-[clamp(6rem,18svh,10rem)]" : "h-[22rem] rounded-[2rem] sm:h-[26rem] lg:h-[clamp(11rem,32svh,28rem)]"
      } ${className}`}
    >
      <div data-map-inner className="absolute inset-0 will-change-transform">
        <div className={`absolute inset-0 transition-[opacity,visibility] duration-700 ease-silk ${loaded ? "invisible opacity-0" : ""}`}>
          <MapSvg id={id} />
          <div className="grain pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-1/2">
            <span data-map-ring className="absolute -left-6 -top-6 size-12 rounded-full bg-forest/25" />
            <span data-map-dot className="absolute -left-1.5 top-1 size-3 rounded-full bg-forest" />
            <div data-map-pin className={`absolute -left-7 -top-[5.5rem] flex flex-col items-center ${mini ? "origin-bottom scale-[.62]" : ""}`}>
              <span className="grid size-14 place-items-center rounded-full border border-forest/20 bg-ivory shadow-card">
                <Lotus base={false} sw={9} className="w-8 text-bronze" />
              </span>
              <span className="h-5 w-px bg-forest/60" />
            </div>
          </div>
          {!mini && (
            <div
              data-map-tag
              className="pointer-events-none absolute bottom-10 left-11 hidden rounded-2xl border border-white/70 bg-ivory/80 px-4 py-2.5 shadow-soft backdrop-blur-md sm:block"
            >
              <span className="block font-display text-[1.15rem] leading-tight text-ink">{clinic.placeName}</span>
              <span className="block text-[0.875rem] text-text">{clinic.street}</span>
            </div>
          )}
        </div>
        {active && (
          <iframe
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            title={`Mapa: ${clinic.placeName}, ${clinic.street}, ${clinic.district}, ${clinic.city}`}
            onLoad={() => setLoaded(true)}
            className="absolute inset-0 size-full border-0"
            style={{ filter: "saturate(.6) sepia(.16)" }}
          />
        )}
      </div>

      {!loaded && (
        <button
          type="button"
          onClick={() => setActive(true)}
          disabled={active}
          className={`absolute z-10 flex items-center gap-2 rounded-full bg-ivory/80 text-ink shadow-soft backdrop-blur ${
            mini ? "bottom-2 left-2 px-3 py-2 text-[0.7rem]" : "bottom-4 left-4 px-4 py-2.5 text-sm"
          }`}
        >
          <svg viewBox="0 0 24 24" className={`${mini ? "size-3.5" : "size-4"} ${active ? "animate-pulse" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14" />
          </svg>
          {active ? "Carregando o mapa..." : mini ? "Ver mapa" : "Ver mapa interativo"}
        </button>
      )}
      {mini && (
        <div className="absolute bottom-2 right-2 z-10 flex gap-2 text-[0.7rem] font-medium">
          <a href={mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-forest px-3 py-2 text-ivory">
            Como chegar<span className="sr-only"> (abre em nova aba)</span>
          </a>
          <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ivory/90 px-3 py-2 text-forest">
            Waze<span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        {loaded ? "Mapa interativo carregado." : ""}
      </span>
    </div>
  );
}
