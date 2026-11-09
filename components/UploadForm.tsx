"use client";
import { useState } from "react"; import { useRouter } from "next/navigation";
const put = async (kind: "audio" | "cover", f: File) => {
  const r = await fetch("/api/upload/sign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, contentType: f.type, size: f.size }) });
  const d = await r.json(); if (!r.ok) throw new Error(d.error || "Upload failed");
  const up = await fetch(d.uploadUrl, { method: "PUT", headers: { "Content-Type": f.type }, body: f });
  if (!up.ok) throw new Error("Could not send the file to storage. Check the bucket CORS settings."); return d.publicUrl as string;
};
const duration = (f: File) => new Promise<number>(res => { const a = new Audio(URL.createObjectURL(f)); a.onloadedmetadata = () => res(Math.round(a.duration) || 0); a.onerror = () => res(0); });
export default function UploadForm() {
  const r = useRouter(); const [v, setV] = useState({ title: "", genre: "", description: "", license: "own", ok: false });
  const [audio, setAudio] = useState<File | null>(null); const [cover, setCover] = useState<File | null>(null); const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) {
    e.preventDefault(); setErr(""); if (!audio) return setErr("Choose an audio file"); if (!v.ok) return setErr("Confirm that you have the rights to distribute this music");
    setBusy(true);
    try {
      setMsg("Uploading audio…"); const audioUrl = await put("audio", audio); let coverUrl: string | undefined;
      if (cover) { setMsg("Uploading cover…"); coverUrl = await put("cover", cover); }
      setMsg("Publishing…"); const res = await fetch("/api/tracks/create", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: v.title, genre: v.genre, description: v.description || undefined, license: v.license, rightsConfirmed: true, audioUrl, coverUrl, durationSec: await duration(audio) }) });
      const d = await res.json(); if (!res.ok) throw new Error(d.error || "Could not publish"); r.push(`/track/${d.id}`);
    } catch (x) { setErr(x instanceof Error ? x.message : "Something went wrong"); setBusy(false); setMsg(""); }
  }
  const inp = "h-11 w-full rounded bg-surface px-3 outline-none", lbl = "mb-1 block text-xs font-semibold text-mute";
  return (<form onSubmit={go} className="flex flex-col gap-4">
    <div><label className={lbl}>Audio file (MP3, M4A, WAV, OGG; up to 60 MB)</label><input type="file" accept="audio/*" onChange={e => setAudio(e.target.files?.[0] ?? null)} className="text-sm" /></div>
    <div><label className={lbl}>Cover (optional; JPG, PNG, WebP; up to 5 MB)</label><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setCover(e.target.files?.[0] ?? null)} className="text-sm" /></div>
    <input className={inp} placeholder="Track title" value={v.title} onChange={e => setV({ ...v, title: e.target.value })} required maxLength={120} />
    <input className={inp} placeholder="Genre" value={v.genre} onChange={e => setV({ ...v, genre: e.target.value })} required maxLength={40} />
    <textarea className="min-h-24 rounded bg-surface p-3 outline-none" placeholder="Description (optional)" value={v.description} onChange={e => setV({ ...v, description: e.target.value })} maxLength={1000} />
    <div><label className={lbl}>Rights status</label><select className={inp} value={v.license} onChange={e => setV({ ...v, license: e.target.value })}>
      <option value="own">I created this music and own all rights</option><option value="cc0">CC0 / public domain</option><option value="cc-by">CC BY 4.0 (credit the author)</option>
      <option value="cc-by-sa">CC BY-SA 4.0</option><option value="licensed">I hold a licence to distribute it</option></select></div>
    <label className="flex gap-3 text-sm text-[#B5B5BA]"><input type="checkbox" checked={v.ok} onChange={e => setV({ ...v, ok: e.target.checked })} className="mt-1" />
      <span>I confirm that I own or have the right to distribute this recording and the composition, and that it contains no uncleared samples. I understand that tracks that break this rule will be removed.</span></label>
    {err && <p className="text-sm text-ember">{err}</p>}{msg && <p className="text-sm text-mute">{msg}</p>}
    <button disabled={busy} className="h-11 rounded bg-[#ECE9E4] font-semibold text-ink disabled:opacity-60">{busy ? "Please wait" : "Publish track"}</button></form>);
}
