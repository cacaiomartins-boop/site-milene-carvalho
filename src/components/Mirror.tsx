import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ } from "../motion/setup";
import { mirror } from "../data/clinic";
import { Eyebrow, SplitHeading } from "./ui";
import { Lotus, lotusReset, lotusBloom } from "./Lotus";
import { WhatsAppButton } from "./WhatsAppButton";

export default function Mirror() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const $ = (s: string) => root.querySelector<HTMLElement>(s)!;
      const lines = gsap.utils.toArray<HTMLElement>("[data-mirror-line]", root);
      const markers = gsap.utils.toArray<HTMLElement>("[data-mirror-marker]", root);
      const lotus = $("[data-mirror-lotus]");
      const closing = $("[data-mirror-closing]");
      const list = $("[data-mirror-list]");
      const win = $("[data-mirror-window]");
      const petals = gsap.utils.toArray<SVGPathElement>(".lotus-petal", lotus);
      const mm = gsap.matchMedia();

      /* ---------- Desktop: seção fixada ---------- */
      mm.add(MQ.desktop, () => {
        root.dataset.pinned = "true";
        gsap.set(lines, { opacity: 0.35, x: 16 });
        gsap.set(markers, { opacity: 0, scale: 0 });
        gsap.set(closing, { opacity: 0, y: 28 });
        lotusReset(lotus);
        gsap.set(list, { y: 0 });

        const maxShift = () => Math.max(0, list.scrollHeight - win.clientHeight);
        const yFor = (el: HTMLElement) => -Math.min(maxShift(), Math.max(0, el.offsetTop - win.clientHeight * 0.32));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => "+=" + 1.6 * window.innerHeight,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
          defaults: { ease: "none" },
        });

        lines.forEach((line, i) => {
          if (i > 0) {
            tl.to(lines[i - 1], { opacity: 0.75, duration: 0.4 }, i);
            tl.to(markers[i - 1], { scale: 0, opacity: 0, duration: 0.3 }, i);
          }
          tl.to(line, { opacity: 1, x: 0, duration: 0.5, ease: "power1.out" }, i);
          tl.to(markers[i], { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, i + 0.08);
          if (petals[i]) tl.to(petals[i], { drawSVG: "0% 100%", duration: 0.9, ease: "power1.inOut" }, i);
          tl.to(list, { y: () => yFor(line), duration: 0.6, ease: "power1.out" }, i);
        });
        const n = lines.length;
        tl.to(lotus.querySelectorAll(".lotus-dot"), { scale: 1, duration: 0.4, ease: "back.out(2)" }, n)
          .to(lotus.querySelectorAll(".lotus-rule"), { drawSVG: "0% 100%", duration: 0.8 }, n)
          .to(lines[n - 1], { opacity: 0.75, duration: 0.4 }, n)
          .to(closing, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, n)
          .to(list, { y: () => -maxShift(), duration: 0.7, ease: "power1.out" }, n);

        const onFocus = () => tl.scrollTrigger?.scroll(tl.scrollTrigger.end);
        closing.addEventListener("focusin", onFocus);
        return () => {
          closing.removeEventListener("focusin", onFocus);
          delete root.dataset.pinned;
        };
      });

      /* ---------- Mobile / tela baixa: sem pin ---------- */
      mm.add(MQ.notDesktop, () => {
        lines.forEach((line, i) => {
          const marker = markers[i];
          const set = (state: "lit" | "settled" | "dim") => {
            if (state === "lit") {
              gsap.to(line, { opacity: 1, x: 0, duration: 0.9 });
              gsap.to(marker, { scale: 1, opacity: 1, duration: 0.9 });
            } else if (state === "settled") {
              gsap.to(line, { opacity: 0.75, x: 0, duration: 0.9 });
              gsap.to(marker, { scale: 0, opacity: 0, duration: 0.5 });
            } else {
              gsap.to(line, { opacity: 0.35, x: 16, duration: 0.9 });
              gsap.to(marker, { scale: 0, opacity: 0, duration: 0.5 });
            }
          };
          gsap.set(line, { opacity: 0.35, x: 16 });
          gsap.set(marker, { scale: 0, opacity: 0 });
          ScrollTrigger_create(line, set);
        });
        const tl = gsap.timeline({ scrollTrigger: { trigger: lotus, start: "top 85%", once: true, end: "max" } });
        lotusReset(lotus);
        lotusBloom(tl, lotus, 0, { petal: 1.4 });
        gsap.fromTo(
          closing.children,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.14, scrollTrigger: { trigger: closing, start: "top 85%", once: true, end: "max" } },
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="espelho" ref={ref} data-mirror className="relative overflow-clip bg-linen section-pad">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Eyebrow n="01">Talvez seja com você</Eyebrow>
          <SplitHeading text={mirror.title} className="max-w-[14ch]" />
          <div data-mirror-lotus className="mt-10 w-[min(70%,14rem)] text-bronze lg:w-[min(100%,24rem)]">
            <Lotus base sw={1.6} className="w-full" />
          </div>
        </div>

        <div className="lg:col-span-7 lg:self-center">
          <div data-mirror-window>
            <ol data-mirror-list className="divide-y divide-bronze/25 border-y border-bronze/25">
              {mirror.lines.map((l, i) => (
                <li
                  key={i}
                  data-mirror-line
                  className="grid grid-cols-[1.75rem_1fr] items-center gap-x-5 py-6 sm:grid-cols-[2rem_1fr] sm:gap-x-7 sm:py-7"
                >
                  <span className="text-xs font-medium tracking-[0.2em] text-bronze">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex items-center justify-between gap-4">
                    <span data-mirror-text className="font-display text-[1.4rem] leading-[1.25] text-ink sm:text-[1.6rem]">
                      {l}
                    </span>
                    <span data-mirror-marker className="size-2.5 shrink-0 rounded-full bg-bronze" aria-hidden="true" />
                  </span>
                </li>
              ))}
              <li data-mirror-closing className="list-none border-0 py-8">
                <p className="max-w-[34rem] text-[1.1rem] text-text">{mirror.closing}</p>
                <div className="mt-6">
                  <WhatsAppButton variant="outline" message="espelho">
                    {mirror.button}
                  </WhatsAppButton>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ScrollTrigger } from "gsap/ScrollTrigger";
function ScrollTrigger_create(line: HTMLElement, set: (s: "lit" | "settled" | "dim") => void) {
  ScrollTrigger.create({
    trigger: line,
    start: "top 65%",
    end: "bottom 65%",
    onEnter: () => set("lit"),
    onEnterBack: () => set("lit"),
    onLeave: () => set("settled"),
    onLeaveBack: () => set("dim"),
  });
}
