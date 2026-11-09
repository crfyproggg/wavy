"use client";
import { usePlayer, PTrack } from "./Player"; import Cover from "./Cover";
export default function TrackCard({ t, queue }: { t: PTrack; queue: PTrack[] }) {
  const { play } = usePlayer();
  return (<button onClick={() => play(t, queue)} className="w-36 shrink-0 snap-start text-left">
    <Cover title={t.title} url={t.coverUrl} className="h-36 w-36" />
    <span className="mt-2 block truncate text-[13px] font-semibold">{t.title}</span><span className="block truncate text-xs text-mute">{t.artist.name}</span></button>);
}
