import { NextResponse } from "next/server"; import { db } from "@/lib/db";
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  const tracks = await db.track.findMany({ where: { status: "PUBLISHED", ...(q ? { OR: [
    { title: { contains: q, mode: "insensitive" } }, { genre: { contains: q, mode: "insensitive" } },
    { artist: { name: { contains: q, mode: "insensitive" } } }, { album: { title: { contains: q, mode: "insensitive" } } }] } : {}) },
    include: { artist: true, _count: { select: { likes: true } } }, orderBy: { playCount: "desc" }, take: 50 });
  return NextResponse.json(tracks);
}
