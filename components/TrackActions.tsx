"use client";
import { useState } from "react"; import { usePlayer, PTrack } from "./Player";
export default function TrackActions({ t, liked: l0, likes }: { t: PTrack; liked: boolean; likes: number }) {
  const { play } = usePlayer(); const [liked, setLiked] = useState(l0); const [n, setN] = useState(likes); const [err, setErr] = useState("");
  async function like() {
    const r = await fetch(`/api/tracks/${t.id}/like`, { method: "POST" });
    if (r.status === 401) return setErr("Sign in to like tracks");
    const d = await r.json(); setLiked(d.liked); setN(n + (d.liked ? 1 : -1)); setErr("");
  }
  return (<div className="flex flex-wrap items-center gap-3">
    <button onClick={() => play(t)} className="rounded bg-[#ECE9E4] px-6 py-2 font-semibold text-ink">Play</button>
    <button onClick={like} className={`rounded bg-surface px-4 py-2 font-semibold ${liked ? "text-ember" : ""}`}>{liked ? "♥" : "♡"} {n}</button>
    {err && <span className="text-sm text-mute">{err}</span>}</div>);
}
