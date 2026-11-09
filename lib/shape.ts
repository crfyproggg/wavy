import type { PTrack } from "@/components/Player";
export const toP = (t: { id: string; title: string; audioUrl: string; coverUrl: string | null; artist: { name: string } }): PTrack =>
  ({ id: t.id, title: t.title, audioUrl: t.audioUrl, coverUrl: t.coverUrl, artist: { name: t.artist.name } });
