import { db } from "@/lib/db"; import TrackRow from "@/components/TrackRow";
export const dynamic = "force-dynamic";
export default async function Home() {
  const tracks = await db.track.findMany({ where: { status: "PUBLISHED" }, include: { artist: true }, orderBy: { playCount: "desc" }, take: 30 });
  const q = tracks.map(t => ({ id: t.id, title: t.title, audioUrl: t.audioUrl, coverUrl: t.coverUrl, artist: { name: t.artist.name } }));
  return (<main className="mx-auto max-w-2xl p-4"><h1 className="mb-4 text-3xl font-bold text-violet">WAVY</h1>
    <h2 className="mb-2 text-lg font-semibold">Trending</h2>
    {q.length ? q.map(t => <TrackRow key={t.id} t={t} queue={q} />) : <p className="text-white/60">No tracks yet. Run <code>npm run seed</code> or upload one.</p>}</main>);
}
