// Runs on every deploy; does nothing if tracks already exist. Add ONLY CC0/CC-BY .mp3 files to public/demo.
import { PrismaClient } from "@prisma/client"; import fs from "fs";
const db = new PrismaClient();
(async () => {
  if ((await db.track.count()) > 0 || !fs.existsSync("public/demo")) return;
  const files = fs.readdirSync("public/demo").filter(f => f.endsWith(".mp3"));
  if (!files.length) return;
  const artist = await db.artist.create({ data: { name: "Demo Artist" } });
  for (const f of files)
    await db.track.create({ data: { title: f.replace(".mp3", ""), genre: "Demo", audioUrl: `/demo/${f}`, license: "CC0 (verify before adding)", rightsConfirmed: true, status: "PUBLISHED", artistId: artist.id } });
})().finally(() => db.$disconnect());
