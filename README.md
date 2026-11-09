# WAVY
Setup: `cp .env.example .env` → fill values → `npm i && npx prisma migrate dev && npm run seed && npm run dev`.
Telegram: create a bot in @BotFather, set TELEGRAM_BOT_TOKEN, point the Mini App URL at your HTTPS deployment.
Add CC0/CC-BY .mp3 files to `public/demo/` (and a `cover.png`) before seeding.
## Built
Prisma schema (all entities), email + Telegram auth (HMAC-verified initData), tracks search/like API, real-audio player (queue, seek, volume, shuffle, repeat, mini/full, position restore), home feed.
## Not yet built
Upload with S3 + rights check, comments/reposts/follows endpoints, playlist UI/reorder, artist/album/genre pages, profile/settings, admin panel, bottom nav + BackButton/MainButton, premium gating, analytics.

## Track uploads (S3-compatible storage)
1. Create a bucket (Cloudflare R2, Backblaze B2, AWS S3 or similar) and make its objects publicly readable; copy the public base URL into `S3_PUBLIC_URL`.
2. Create an API key with read/write access to that bucket: `S3_KEY`, `S3_SECRET`; `S3_ENDPOINT` is the provider's S3 endpoint, `S3_BUCKET` the bucket name.
3. Bucket CORS: allow origin = your site URL, method `PUT`, headers `*`.
4. Add the variables in Vercel (Settings, Environment Variables) and redeploy.
Uploads store the rights declaration (type, user, timestamp). This is a self-declaration, not automatic verification: add moderation (admin panel) before opening the site to the public.
