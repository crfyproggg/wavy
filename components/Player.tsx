"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cover, { hueOf } from "./Cover";
export type PTrack = { id: string; title: string; audioUrl: string; coverUrl?: string | null; artist: { name: string } };
type Ctx = { play: (t: PTrack, q?: PTrack[]) => void; currentId?: string; playing: boolean };
const C = createContext<Ctx>({ play() {}, playing: false }); export const usePlayer = () => useContext(C);
const P = { play: "M8 5v14l11-7z", pause: "M6 5h4v14H6zM14 5h4v14h-4z", next: "M6 6l8.5 6L6 18zM16 6h2v12h-2z", prev: "M18 18l-8.5-6L18 6zM6 6h2v12H6z" };
const Ic = ({ d, s = 24 }: { d: string; s?: number }) => <svg viewBox="0 0 24 24" width={s} height={s} fill="currentColor"><path d={d} /></svg>;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function PlayerProvider({ children }: { children: ReactNode }) {
  const a = useRef<HTMLAudioElement>(null);
  const [queue, setQueue] = useState<PTrack[]>([]); const [i, setI] = useState(-1);
  const [playing, setPlaying] = useState(false); const [pos, setPos] = useState(0); const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(1); const [shuffle, setShuffle] = useState(false); const [repeat, setRepeat] = useState<"off" | "all" | "one">("off");
  const [full, setFull] = useState(false); const cur = queue[i];

  useEffect(() => { // restore last session
    try { const s = JSON.parse(localStorage.getItem("wavy:p") || "null"); if (s?.queue?.length) { setQueue(s.queue); setI(s.i); if (a.current) { a.current.src = s.queue[s.i].audioUrl; a.current.currentTime = s.pos; } } } catch {}
  }, []);
  useEffect(() => { if (cur) localStorage.setItem("wavy:p", JSON.stringify({ queue, i, pos })); }, [queue, i, Math.floor(pos / 3)]);
  useEffect(() => { if (a.current) a.current.volume = vol; }, [vol]);

  const load = (n: number, q = queue) => { const t = q[n]; if (!t || !a.current) return; setI(n); a.current.src = t.audioUrl; a.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); };
  const play = (t: PTrack, q: PTrack[] = [t]) => { setQueue(q); load(q.findIndex(x => x.id === t.id), q); };
  const next = () => { if (!queue.length) return; load(shuffle ? Math.floor(Math.random() * queue.length) : (i + 1) % queue.length); };
  const prev = () => (pos > 3 ? (a.current!.currentTime = 0) : load((i - 1 + queue.length) % queue.length));
  const toggle = () => { const el = a.current!; if (el.paused) el.play().then(() => setPlaying(true)); else { el.pause(); setPlaying(false); } };
  const ended = () => { if (repeat === "one") { a.current!.currentTime = 0; a.current!.play(); } else if (repeat === "all" || i < queue.length - 1 || shuffle) next(); else setPlaying(false); };

  const pct = dur ? (pos / dur) * 100 : 0; const h = cur ? hueOf(cur.title) : 270;
  const btn = "grid h-11 w-11 place-items-center rounded-full transition active:scale-95 hover:bg-white/10";
  return (<C.Provider value={{ play, currentId: cur?.id, playing }}>
    <audio ref={a} onTimeUpdate={e => setPos(e.currentTarget.currentTime)} onLoadedMetadata={e => setDur(e.currentTarget.duration)} onEnded={ended} />
    {children}
    <AnimatePresence>{cur && !full && (
      <motion.div key="mini" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        className="fixed inset-x-2 bottom-[calc(env(safe-area-inset-bottom)+68px)] z-50 overflow-hidden rounded-xl border border-line bg-ink-2/95 backdrop-blur sm:bottom-2">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-white/10"><div className="h-full bg-violet" style={{ width: `${pct}%` }} /></div>
        <div className="flex items-center gap-3 p-2">
          <button onClick={() => setFull(true)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label="Open player">
            <Cover title={cur.title} url={cur.coverUrl} className={`h-11 w-11 shrink-0`} />
            <span className="min-w-0"><span className="block truncate font-semibold">{cur.title}</span><span className="block truncate text-sm text-white/55">{cur.artist.name}</span></span>
          </button>
          <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid h-11 w-11 place-items-center rounded-full bg-violet"><Ic d={playing ? P.pause : P.play} /></button>
          <button onClick={next} aria-label="Next" className={btn}><Ic d={P.next} /></button>
        </div>
      </motion.div>)}
    {cur && full && (
      <motion.div key="full" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between px-6 pb-8 pt-6" style={{ background: `radial-gradient(120% 70% at 50% 0%, hsl(${h} 25% 22%), #121212 70%)`, paddingTop: "calc(env(safe-area-inset-top) + 16px)" }}>
        <button onClick={() => setFull(false)} className="self-start rounded-full px-3 py-1 text-sm text-white/70 hover:bg-white/10">Close</button>
        <Cover title={cur.title} url={cur.coverUrl} className={`aspect-square w-[min(72vw,320px)] shadow-2xl`} />
        <div className="w-full max-w-md text-center"><p className="truncate text-2xl font-bold">{cur.title}</p><p className="text-white/60">{cur.artist.name}</p></div>
        <div className="w-full max-w-md">
          <input aria-label="Seek" type="range" min={0} max={dur || 1} value={pos} onChange={e => (a.current!.currentTime = +e.target.value)} className="w-full accent-violet" />
          <div className="flex justify-between text-xs text-white/55"><span>{fmt(pos)}</span><span>{fmt(dur || 0)}</span></div>
          <div className="mt-3 flex items-center justify-between">
            <button onClick={() => setShuffle(!shuffle)} aria-label="Shuffle" className={`${btn} ${shuffle ? "text-ember" : "text-white/60"}`}>⇄</button>
            <button onClick={prev} aria-label="Previous" className={btn}><Ic d={P.prev} s={28} /></button>
            <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid h-16 w-16 place-items-center rounded-full bg-violet shadow-[0_8px_30px_-6px_#8B5CFF]"><Ic d={playing ? P.pause : P.play} s={32} /></button>
            <button onClick={next} aria-label="Next" className={btn}><Ic d={P.next} s={28} /></button>
            <button onClick={() => setRepeat(repeat === "off" ? "all" : repeat === "all" ? "one" : "off")} aria-label={`Repeat ${repeat}`} className={`${btn} ${repeat !== "off" ? "text-ember" : "text-white/60"}`}>{repeat === "one" ? "↻1" : "↻"}</button>
          </div>
          <input aria-label="Volume" type="range" min={0} max={1} step={0.05} value={vol} onChange={e => setVol(+e.target.value)} className="mt-4 w-full accent-ember" />
        </div>
      </motion.div>)}
    </AnimatePresence>
  </C.Provider>);
}
