import Link from "next/link"; import { notFound } from "next/navigation"; import { db } from "@/lib/db"; import { currentUser } from "@/lib/auth"; import { toP } from "@/lib/shape";
import Cover from "@/components/Cover"; import TrackActions from "@/components/TrackActions";
export const dynamic = "force-dynamic";
export default async function TrackPage({ params }: { params: { id: string } }) {
  const t = await db.track.findUnique({ where: { id: params.id }, include: { artist: true, comments: { include: { user: true }, orderBy: { at: "desc" }, take: 30 }, _count: { select: { likes: true } } } });
  if (!t || t.status !== "PUBLISHED") notFound();
  const u = await currentUser(); const liked = u ? !!(await db.like.findUnique({ where: { userId_trackId: { userId: u.id, trackId: t.id } } })) : false;
  return (<main className="mx-auto max-w-3xl px-4 py-6">
    <div className="flex flex-col gap-5 rounded-md bg-gradient-to-br from-[#34343A] to-[#1C1C20] p-5 sm:flex-row"><Cover title={t.title} url={t.coverUrl} className="h-52 w-52 shrink-0" />
      <div className="flex flex-col gap-2"><Link href={`/artist/${t.artistId}`} className="text-sm text-[#B5B5BA]">{t.artist.name}</Link><h1 className="text-3xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="text-sm text-mute">{t.genre} · ▶ {t.playCount}</p>{t.description && <p className="text-sm text-[#B5B5BA]">{t.description}</p>}
        <div className="mt-auto"><TrackActions t={toP(t)} liked={liked} likes={t._count.likes} /></div></div></div>
    <h2 className="mb-3 mt-8 text-[22px] font-bold">Comments</h2>
    {t.comments.length ? t.comments.map(c => <p key={c.id} className="mb-3 text-sm"><b>{c.user.displayName}</b> <span className="text-[#B5B5BA]">{c.body}</span></p>) : <p className="text-mute">No comments yet.</p>}
  </main>);
}
