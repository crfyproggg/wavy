"use client";
import { useState } from "react"; import { useRouter } from "next/navigation";
export default function CreatePlaylist() {
  const [name, setName] = useState(""); const [err, setErr] = useState(""); const r = useRouter();
  async function go(e: React.FormEvent) { e.preventDefault(); const res = await fetch("/api/playlists", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    if (!res.ok) return setErr((await res.json()).error || "Could not create playlist"); setName(""); setErr(""); r.refresh(); }
  return (<form onSubmit={go} className="flex gap-2"><input value={name} onChange={e => setName(e.target.value)} placeholder="New playlist name" className="h-9 flex-1 rounded bg-surface px-3 text-sm outline-none" />
    <button className="rounded bg-[#ECE9E4] px-4 text-sm font-semibold text-ink">Create</button>{err && <span className="self-center text-sm text-mute">{err}</span>}</form>);
}
