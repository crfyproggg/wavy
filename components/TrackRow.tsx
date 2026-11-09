"use client";
import Link from "next/link"; import { usePlayer, PTrack } from "./Player"; import Cover from "./Cover";
export default function TrackRow({ t, queue }: { t: PTrack; queue: PTrack[] }) {
  const { play, currentId } = usePlayer(); const on = currentId === t.id;
  return (
    <div className={`flex items-center gap-2 rounded-md pr-3 transition ${on ? "bg-white/10" : "hover:bg-white/5"}`}>
      <button onClick={() => play(t, queue)} className="flex min-w-0 flex-1 items-center gap-3 p-2 text-left">
        <Cover title={t.title} url={t.coverUrl} className="h-12 w-12 shrink-0" />
        <span className="min-w-0"><span className={`block truncate text-sm font-semibold ${on ? "text-ember" : ""}`}>{t.title}</span><span className="block truncate text-xs text-mute">{t.artist.name}</span></span>
      </button>
      <Link href={`/track/${t.id}`} className="text-xs font-semibold text-mute hover:text-white">Details</Link>
    </div>
  );
}
