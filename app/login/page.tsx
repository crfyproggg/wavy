"use client";
import { useState } from "react"; import { useRouter } from "next/navigation";
export default function Login() {
  const [reg, setReg] = useState(false); const [f, setF] = useState({ email: "", password: "", displayName: "" }); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const r = useRouter();
  async function go(e: React.FormEvent) { e.preventDefault(); setBusy(true); setErr("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: f.email, password: f.password, ...(reg ? { displayName: f.displayName } : {}) }) });
    setBusy(false); if (!res.ok) return setErr((await res.json()).error || "Something went wrong"); r.push("/library"); r.refresh(); }
  const inp = "h-11 w-full rounded bg-surface px-3 outline-none";
  return (<main className="mx-auto max-w-sm px-4 py-12"><h1 className="mb-6 text-3xl font-extrabold tracking-tight">{reg ? "Create account" : "Sign in"}</h1>
    <form onSubmit={go} className="flex flex-col gap-3">{reg && <input className={inp} placeholder="Display name" value={f.displayName} onChange={e => setF({ ...f, displayName: e.target.value })} required />}
      <input className={inp} type="email" placeholder="Email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required />
      <input className={inp} type="password" placeholder="Password (8+ characters)" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} required />
      {err && <p className="text-sm text-ember">{err}</p>}<button disabled={busy} className="h-11 rounded bg-[#ECE9E4] font-semibold text-ink disabled:opacity-60">{busy ? "Please wait" : reg ? "Create account" : "Sign in"}</button></form>
    <button onClick={() => setReg(!reg)} className="mt-4 text-sm text-mute">{reg ? "Have an account? Sign in" : "New here? Create an account"}</button></main>);
}
