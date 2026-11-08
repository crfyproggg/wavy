import { NextResponse } from "next/server"; import { db } from "@/lib/db"; import { currentUser } from "@/lib/auth";
export async function POST(_: Request, { params }: { params: { id: string } }) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "Sign in to like tracks" }, { status: 401 });
  const k = { userId_trackId: { userId: u.id, trackId: params.id } };
  const had = await db.like.findUnique({ where: k });
  if (had) await db.like.delete({ where: k }); else await db.like.create({ data: { userId: u.id, trackId: params.id } });
  return NextResponse.json({ liked: !had });
}
