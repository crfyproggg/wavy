# WAVY
Setup: `cp .env.example .env` → fill values → `npm i && npx prisma migrate dev && npm run seed && npm run dev`.
Telegram: create a bot in @BotFather, set TELEGRAM_BOT_TOKEN, point the Mini App URL at your HTTPS deployment.
Add CC0/CC-BY .mp3 files to `public/demo/` (and a `cover.png`) before seeding.
## Built
Prisma schema (all entities), email + Telegram auth (HMAC-verified initData), tracks search/like API, real-audio player (queue, seek, volume, shuffle, repeat, mini/full, position restore), home feed.
## Not yet built
Upload with S3 + rights check, comments/reposts/follows endpoints, playlist UI/reorder, artist/album/genre pages, profile/settings, admin panel, bottom nav + BackButton/MainButton, premium gating, analytics.
