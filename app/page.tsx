import Link from "next/link"; import { db } from "@/lib/db"; import { toP } from "@/lib/shape";
import TrackRow from "@/components/TrackRow"; import TrackCard from "@/components/TrackCard"; import Cover from "@/components/Cover";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [top, fresh, artists] = await Promise.all([
    db.track.findMany({ where: { status: "PUBLISHED" }, include: { artist: true }, orderBy: { playCount: "desc" }, take: 12 }),
    db.track.findMany({ where: { status: "PUBLISHED" }, include: { artist: true }, orderBy: { createdAt: "desc" }, take: 12 }),
    db.artist.findMany({ orderBy: { tracks: { _count: "desc" } }, take: 8 })]);
  const q = top.map(toP), n = fresh.map(toP);
  return (<main className="mx-auto max-w-5xl px-4 py-6">
    <h2 className="mb-4 text-[22px] font-bold">Trending</h2>
    {q.length ? <div className="-mx-4 mb-9 flex snap-x gap-4 overflow-x-auto px-4 pb-2">{q.map(t => <TrackCard key={t.id} t={t} queue={q} />)}</div>
      : <p className="mb-9 rounded-md border border-line p-6 text-mute">No tracks yet. Add licensed .mp3 files to public/demo and redeploy.</p>}
    {artists.length > 0 && <><h2 className="mb-4 text-[22px] font-bold">Popular artists</h2>
      <div className="-mx-4 mb-9 flex gap-5 overflow-x-auto px-4 pb-2">{artists.map(a => <Link key={a.id} href={`/artist/${a.id}`} className="w-28 shrink-0 text-center"><Cover title={a.name} url={a.imageUrl} className="!rounded-full h-28 w-28" /><span className="mt-2 block truncate text-[13px] font-semibold">{a.name}</span></Link>)}</div></>}
    {n.length > 0 && <><h2 className="mb-3 text-[22px] font-bold">New releases</h2><div>{n.map(t => <TrackRow key={t.id} t={t} queue={n} />)}</div></>}
  </main>);
}
