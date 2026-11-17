import { Lotus } from "./Lotus";
import { clinic } from "../data/clinic";

/** Wordmark em texto: lótus + nome em maiúsculas + profissão. */
export function Wordmark({ compact = false, noLotus = false, className = "" }: { compact?: boolean; noLotus?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 leading-none ${className}`}>
      {!noLotus && <Lotus base={false} sw={compact ? 7 : 6} className={compact ? "h-9 w-auto" : "h-8 w-auto"} />}
      <span className="flex flex-col gap-1.5">
        <span className="overflow-hidden">
          <span data-logo-word className="block font-display text-[1.3rem] font-medium uppercase tracking-[0.26em] whitespace-nowrap sm:text-[1.35rem]">
            {clinic.name}
          </span>
        </span>
        <span data-logo-role className="block text-[0.6rem] font-medium uppercase tracking-[0.42em] opacity-80">
          Psicologia
        </span>
      </span>
    </span>
  );
}
