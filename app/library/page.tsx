import Link from "next/link"; import { db } from "@/lib/db"; import { currentUser } from "@/lib/auth"; import { toP } from "@/lib/shape"; import TrackRow from "@/components/TrackRow"; import CreatePlaylist from "@/components/CreatePlaylist";
export const dynamic = "force-dynamic";
export default async function Library() {
  const u = await currentUser();
  if (!u) return <main className="mx-auto max-w-3xl px-4 py-10"><p className="mb-4 text-mute">Sign in to see your liked tracks and playlists.</p><Link href="/login" className="rounded bg-[#ECE9E4] px-5 py-2 font-semibold text-ink">Sign in</Link></main>;
  const [likes, lists] = await Promise.all([db.like.findMany({ where: { userId: u.id }, include: { track: { include: { artist: true } } } }), db.playlist.findMany({ where: { ownerId: u.id }, include: { _count: { select: { items: true } } } })]);
  const tracks = likes.map(l => toP(l.track));
  return (<main className="mx-auto max-w-3xl px-4 py-6"><h1 className="mb-6 text-3xl font-extrabold tracking-tight">{u.displayName}</h1>
    <h2 className="mb-3 text-[22px] font-bold">Playlists</h2><div className="mb-3"><CreatePlaylist /></div>
    <div className="mb-8 flex flex-wrap gap-2">{lists.map(p => <span key={p.id} className="rounded bg-surface px-3 py-2 text-sm">{p.name} <span className="text-mute">· {p._count.items}</span></span>)}</div>
    <h2 className="mb-3 text-[22px] font-bold">Liked tracks</h2>{tracks.length ? tracks.map(t => <TrackRow key={t.id} t={t} queue={tracks} />) : <p className="text-mute">Like a track on its page and it will appear here.</p>}
  </main>);
}
