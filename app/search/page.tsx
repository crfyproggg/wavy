import Link from "next/link"; import { db } from "@/lib/db"; import { toP } from "@/lib/shape"; import TrackRow from "@/components/TrackRow";
export const dynamic = "force-dynamic";
export default async function Search({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || "").trim(); const has = (f: object) => ({ contains: q, mode: "insensitive" as const, ...f });
  const tracks = q ? await db.track.findMany({ where: { status: "PUBLISHED", OR: [{ title: has({}) }, { genre: has({}) }, { artist: { name: has({}) } }, { album: { title: has({}) } }] }, include: { artist: true }, take: 40 }) : [];
  const artists = q ? await db.artist.findMany({ where: { name: has({}) }, take: 8 }) : [];
  const list = tracks.map(toP);
  return (<main className="mx-auto max-w-3xl px-4 py-6">
    <form action="/search"><input name="q" defaultValue={q} autoFocus placeholder="Search tracks, artists, albums, genres" className="mb-6 h-11 w-full rounded-full border border-line bg-surface px-5 outline-none" /></form>
    {q && !list.length && !artists.length && <p className="text-mute">Nothing found for “{q}”. Try a different title, artist or genre.</p>}
    {artists.map(a => <Link key={a.id} href={`/artist/${a.id}`} className="mb-2 block rounded-md bg-surface p-3 font-semibold">{a.name} <span className="font-normal text-mute">· Artist</span></Link>)}
    {list.map(t => <TrackRow key={t.id} t={t} queue={list} />)}
  </main>);
}
