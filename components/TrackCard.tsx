"use client";
import { usePlayer, PTrack } from "./Player"; import Cover from "./Cover";
export default function TrackCard({ t, queue }: { t: PTrack; queue: PTrack[] }) {
  const { play } = usePlayer();
  return (
    <button onClick={() => play(t, queue)} className="w-36 shrink-0 snap-start text-left">
      <Cover title={t.title} url={t.coverUrl} className="h-36 w-36 shadow-[0_12px_40px_-12px_rgba(139,92,255,.6)] transition hover:scale-[1.03]" />
      <span className="mt-3 block truncate font-semibold">{t.title}</span><span className="block truncate text-sm text-white/55">{t.artist.name}</span>
    </button>
  );
}
