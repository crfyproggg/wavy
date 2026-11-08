"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
export type PTrack = { id: string; title: string; audioUrl: string; coverUrl?: string | null; artist: { name: string } };
type Ctx = { play: (t: PTrack, q?: PTrack[]) => void };
const C = createContext<Ctx>({ play() {} }); export const usePlayer = () => useContext(C);
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

  return (<C.Provider value={{ play }}>
    <audio ref={a} onTimeUpdate={e => setPos(e.currentTarget.currentTime)} onLoadedMetadata={e => setDur(e.currentTarget.duration)} onEnded={ended} />
    {children}
    <AnimatePresence>{cur && (
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className={`fixed inset-x-0 bottom-0 z-50 bg-ink-2/95 backdrop-blur border-t border-white/10 ${full ? "top-0 flex flex-col items-center justify-center gap-6 p-8" : "px-4 py-2"}`}>
        <div className={full ? "flex flex-col items-center gap-6" : "flex items-center gap-3"}>
          <motion.img onClick={() => setFull(!full)} animate={{ rotate: playing ? 360 : 0 }} transition={playing ? { repeat: Infinity, duration: 12, ease: "linear" } : {}}
            src={cur.coverUrl || "/demo/cover.png"} alt="" className={`${full ? "h-64 w-64" : "h-10 w-10"} rounded-full object-cover`} />
          <div><p className="font-semibold">{cur.title}</p><p className="text-sm text-white/60">{cur.artist.name}</p></div>
        </div>
        <input aria-label="Seek" type="range" min={0} max={dur || 1} value={pos} onChange={e => (a.current!.currentTime = +e.target.value)} className={full ? "w-full max-w-md" : "w-full"} />
        <div className="flex items-center gap-4 text-sm">
          <span>{fmt(pos)}/{fmt(dur || 0)}</span>
          <button onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-violet" : ""}>Shuffle</button>
          <button onClick={prev}>Prev</button><button onClick={toggle} className="rounded-full bg-violet px-4 py-1">{playing ? "Pause" : "Play"}</button><button onClick={next}>Next</button>
          <button onClick={() => setRepeat(repeat === "off" ? "all" : repeat === "all" ? "one" : "off")}>Repeat: {repeat}</button>
          <input aria-label="Volume" type="range" min={0} max={1} step={0.05} value={vol} onChange={e => setVol(+e.target.value)} className="w-20" />
        </div>
      </motion.div>)}</AnimatePresence>
  </C.Provider>);
}
