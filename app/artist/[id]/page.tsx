import { notFound } from "next/navigation"; import { db } from "@/lib/db"; import { toP } from "@/lib/shape"; import TrackRow from "@/components/TrackRow"; import Cover from "@/components/Cover";
export const dynamic = "force-dynamic";
export default async function ArtistPage({ params }: { params: { id: string } }) {
  const a = await db.artist.findUnique({ where: { id: params.id }, include: { tracks: { where: { status: "PUBLISHED" }, include: { artist: true }, orderBy: { playCount: "desc" } }, _count: { select: { followers: true } } } });
  if (!a) notFound(); const list = a.tracks.map(toP);
  return (<main className="mx-auto max-w-3xl px-4 py-6">
    <div className="mb-8 flex items-center gap-5 rounded-md bg-gradient-to-br from-[#34343A] to-[#1C1C20] p-5"><Cover title={a.name} url={a.imageUrl} className="!rounded-full h-28 w-28 shrink-0" />
      <div><h1 className="text-3xl font-extrabold tracking-tight">{a.name}</h1><p className="text-sm text-mute">{a._count.followers} followers · {list.length} tracks</p>{a.bio && <p className="mt-2 text-sm text-[#B5B5BA]">{a.bio}</p>}</div></div>
    <h2 className="mb-3 text-[22px] font-bold">Popular tracks</h2>{list.length ? list.map(t => <TrackRow key={t.id} t={t} queue={list} />) : <p className="text-mute">No published tracks yet.</p>}
  </main>);
}
