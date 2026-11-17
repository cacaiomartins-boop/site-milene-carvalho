import { Wind, CloudSun, HeartHandshake, Repeat, Activity, Globe, Video, type LucideIcon } from "lucide-react";

export const topicIcon: Record<string, LucideIcon> = {
  ansiedade: Wind,
  "depressao-e-autoestima": CloudSun,
  relacionamentos: HeartHandshake,
  "compulsoes-e-habitos": Repeat,
  "saude-e-doenca-cronica": Activity,
  "brasileiros-no-exterior": Globe,
  "terapia-online": Video,
};

export function TopicIcon({ slug, className = "size-6", strokeWidth = 1.3 }: { slug: string; className?: string; strokeWidth?: number }) {
  const I = topicIcon[slug] ?? Wind;
  return <I className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
