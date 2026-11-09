import { NextResponse } from "next/server"; import { z } from "zod";
import { db } from "@/lib/db"; import { currentUser } from "@/lib/auth"; import { publicBase, s3Ready } from "@/lib/s3";
const LICENSES: Record<string, string> = { own: "Original work, uploader owns all rights", cc0: "CC0 (public domain)", "cc-by": "CC BY 4.0", "cc-by-sa": "CC BY-SA 4.0", licensed: "Uploader holds a licence to distribute" };
const S = z.object({ title: z.string().trim().min(1).max(120), genre: z.string().trim().min(1).max(40), description: z.string().trim().max(1000).optional(),
  license: z.enum(["own", "cc0", "cc-by", "cc-by-sa", "licensed"]), rightsConfirmed: z.literal(true), audioUrl: z.string().url(), coverUrl: z.string().url().optional(), durationSec: z.number().int().min(0).max(10800) });
export async function POST(req: Request) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "Sign in to upload" }, { status: 401 });
  if (!s3Ready()) return NextResponse.json({ error: "File storage is not configured yet" }, { status: 503 });
  const p = S.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Fill in the title and genre and confirm you have the rights to this music" }, { status: 400 });
  const d = p.data, base = publicBase();
  // Files must live in this user's own folder in our bucket: no arbitrary external URLs.
  if (!d.audioUrl.startsWith(`${base}/audio/${u.id}/`) || (d.coverUrl && !d.coverUrl.startsWith(`${base}/img/${u.id}/`))) return NextResponse.json({ error: "Invalid file location" }, { status: 400 });
  const artist = (await db.artist.findUnique({ where: { userId: u.id } })) ?? (await db.artist.create({ data: { name: u.displayName, userId: u.id } }));
  const t = await db.track.create({ data: { title: d.title, genre: d.genre, description: d.description || null, audioUrl: d.audioUrl, coverUrl: d.coverUrl ?? null,
    durationSec: d.durationSec, license: `${LICENSES[d.license]} (confirmed by user ${u.id} at ${new Date().toISOString()})`, rightsConfirmed: true, status: "PUBLISHED", artistId: artist.id } });
  return NextResponse.json({ id: t.id });
}
