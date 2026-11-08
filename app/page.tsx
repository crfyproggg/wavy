import { db } from "@/lib/db"; import TrackRow from "@/components/TrackRow"; import TrackCard from "@/components/TrackCard";
export const dynamic = "force-dynamic";
export default async function Home() {
  const tracks = await db.track.findMany({ where: { status: "PUBLISHED" }, include: { artist: true }, orderBy: { playCount: "desc" }, take: 30 });
  const q = tracks.map(t => ({ id: t.id, title: t.title, audioUrl: t.audioUrl, coverUrl: t.coverUrl, artist: { name: t.artist.name } }));
  return (
    <main className="mx-auto max-w-2xl px-4 pt-6">
      <header className="mb-8 flex items-end justify-between">
        <h1 className="text-5xl font-extrabold tracking-tight"><span className="bg-gradient-to-r from-violet to-ember bg-clip-text text-transparent">wavy</span></h1>
        <p className="pb-1 text-sm text-white/50">{q.length} tracks</p>
      </header>
      {q.length ? (<>
        <h2 className="mb-3 text-xl font-bold">Trending</h2>
        <div className="hide-scroll -mx-4 mb-8 flex snap-x gap-4 overflow-x-auto px-4 pb-2">{q.slice(0, 8).map(t => <TrackCard key={t.id} t={t} queue={q} />)}</div>
        <h2 className="mb-2 text-xl font-bold">All tracks</h2>
        <div>{q.map(t => <TrackRow key={t.id} t={t} queue={q} />)}</div>
      </>) : <p className="rounded-2xl border border-white/10 p-6 text-white/60">No tracks yet. Add licensed .mp3 files to public/demo and redeploy.</p>}
    </main>
  );
}
