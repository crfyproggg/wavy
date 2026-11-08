"use client";
import { usePlayer, PTrack } from "./Player"; import Cover from "./Cover";
export default function TrackRow({ t, queue }: { t: PTrack; queue: PTrack[] }) {
  const { play, currentId, playing } = usePlayer(); const on = currentId === t.id;
  return (
    <button onClick={() => play(t, queue)} className={`flex w-full items-center gap-3 rounded-2xl p-2 pr-4 text-left transition active:scale-[.99] ${on ? "bg-violet/15" : "hover:bg-white/5"}`}>
      <Cover title={t.title} url={t.coverUrl} className={`h-14 w-14 shrink-0 ${on && playing ? "spin" : ""}`} />
      <span className="min-w-0 flex-1"><span className={`block truncate font-semibold ${on ? "text-violet" : ""}`}>{t.title}</span><span className="block truncate text-sm text-white/55">{t.artist.name}</span></span>
    </button>
  );
}
