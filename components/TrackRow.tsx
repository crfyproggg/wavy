"use client";
import { usePlayer, PTrack } from "./Player";
export default function TrackRow({ t, queue }: { t: PTrack; queue: PTrack[] }) {
  const { play } = usePlayer();
  return (<button onClick={() => play(t, queue)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/5">
    <img src={t.coverUrl || "/demo/cover.png"} alt="" className="h-12 w-12 rounded-lg object-cover" />
    <span><span className="block font-medium">{t.title}</span><span className="text-sm text-white/60">{t.artist.name}</span></span></button>);
}
